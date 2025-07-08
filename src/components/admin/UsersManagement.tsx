import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, ShieldOff, User, Users } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface UserWithRole extends UserProfile {
  user_roles: UserRole[];
  email?: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
}

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Get user emails from edge function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('get-user-emails');
      
      if (emailError) throw emailError;

      const authUsers = emailData?.users || [];

      // Combine the data
      const usersWithRoles: UserWithRole[] = profiles.map(profile => {
        const authUser = authUsers.find((u: any) => u.id === profile.id);
        return {
          ...profile,
          user_roles: userRoles.filter(role => role.user_id === profile.id),
          email: authUser?.email,
          email_confirmed_at: authUser?.email_confirmed_at,
          last_sign_in_at: authUser?.last_sign_in_at
        };
      });

      return usersWithRoles;
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'admin' | 'user' }) => {
      // First, check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Role updated",
        description: "User role has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
      console.error('Role update error:', error);
    }
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (roleFilter === 'all') return matchesSearch;
    
    const userRole = user.user_roles[0]?.role || 'user';
    return matchesSearch && userRole === roleFilter;
  });

  const getUserRole = (user: UserWithRole): 'admin' | 'user' => {
    return user.user_roles[0]?.role || 'user';
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-brand-navy" />
          <h2 className="text-2xl font-bold text-brand-navy">User Management</h2>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-brand-navy/70">Loading users...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter(user => getUserRole(user) === 'admin').length || 0;
  const regularUserCount = totalUsers - adminCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6 text-brand-navy" />
        <h2 className="text-2xl font-bold text-brand-navy">User Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-trans-blue" />
              <div>
                <p className="text-sm text-brand-navy/70">Total Users</p>
                <p className="text-2xl font-bold text-brand-navy">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-trans-pink" />
              <div>
                <p className="text-sm text-brand-navy/70">Administrators</p>
                <p className="text-2xl font-bold text-brand-navy">{adminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-brand-navy" />
              <div>
                <p className="text-sm text-brand-navy/70">Regular Users</p>
                <p className="text-2xl font-bold text-brand-navy">{regularUserCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-navy">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-navy/50 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as 'all' | 'admin' | 'user')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="user">Regular Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => {
                  const userRole = getUserRole(user);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-brand-navy">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-brand-navy/70">
                            {user.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-brand-navy">
                          {user.email || 'No email'}
                        </div>
                        {user.email_confirmed_at && (
                          <div className="text-xs text-green-600">
                            ✓ Verified
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                          {userRole === 'admin' ? (
                            <><Shield className="w-3 h-3 mr-1" /> Admin</>
                          ) : (
                            <><User className="w-3 h-3 mr-1" /> User</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-brand-navy/70">
                          {format(new Date(user.created_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {userRole === 'admin' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange(user.id, 'user')}
                              disabled={updateRoleMutation.isPending}
                            >
                              <ShieldOff className="w-4 h-4 mr-1" />
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              disabled={updateRoleMutation.isPending}
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Make Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredUsers?.length === 0 && (
              <div className="text-center py-8 text-brand-navy/70">
                No users found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;