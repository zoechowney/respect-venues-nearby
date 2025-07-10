import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Trash2, AlertTriangle, FileText, Database } from 'lucide-react';
import GeocodeVenues from './GeocodeVenues';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const DataManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-data-management'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get user emails from edge function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('get-user-emails');
      
      if (emailError) throw emailError;

      const authUsers = emailData?.users || [];

      // Combine the data
      const usersWithEmails = profiles.map(profile => {
        const authUser = authUsers.find((u: any) => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email,
          email_confirmed_at: authUser?.email_confirmed_at,
          last_sign_in_at: authUser?.last_sign_in_at
        };
      });

      return usersWithEmails;
    }
  });

  const exportUserDataMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Get all user data from various tables
      const [profiles, reviews, venues] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId),
        supabase.from('venue_reviews').select('*').eq('user_id', userId),
        supabase.from('venue_applications').select('*').eq('venue_owner_id', userId)
      ]);

      const userData = {
        profile: profiles.data?.[0] || null,
        reviews: reviews.data || [],
        venue_applications: venues.data || [],
        exported_at: new Date().toISOString(),
        export_type: 'GDPR_DATA_EXPORT'
      };

      return userData;
    },
    onSuccess: (data, userId) => {
      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "User data has been exported successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: "Failed to export user data. Please try again.",
        variant: "destructive",
      });
      console.error('Export error:', error);
    }
  });

  const deleteUserDataMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Delete user data from all tables (in correct order due to foreign keys)
      await Promise.all([
        supabase.from('venue_reviews').delete().eq('user_id', userId),
        supabase.from('review_replies').delete().eq('venue_owner_id', userId),
        supabase.from('venue_applications').delete().eq('venue_owner_id', userId),
        supabase.from('user_roles').delete().eq('user_id', userId),
        supabase.from('profiles').delete().eq('id', userId)
      ]);

      // Note: We cannot delete from auth.users via client, this needs to be done via admin API
      return userId;
    },
    onSuccess: (userId) => {
      toast({
        title: "Data deleted",
        description: "User data has been deleted. Note: Auth user deletion requires manual admin action.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-data-management'] });
    },
    onError: (error) => {
      toast({
        title: "Deletion failed",
        description: "Failed to delete user data. Please try again.",
        variant: "destructive",
      });
      console.error('Deletion error:', error);
    }
  });

  const filteredUsers = users?.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = (userId: string) => {
    exportUserDataMutation.mutate(userId);
  };

  const handleDeleteData = (userId: string) => {
    deleteUserDataMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-brand-navy" />
          <h2 className="text-2xl font-bold text-brand-navy">Data Management</h2>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-brand-navy/70">Loading user data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Database className="w-6 h-6 text-brand-navy" />
        <h2 className="text-2xl font-bold text-brand-navy">Data Management</h2>
      </div>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800">GDPR Compliance</h3>
              <p className="text-sm text-orange-700 mt-1">
                Use these tools to help users exercise their data protection rights. Always verify 
                user identity before processing deletion requests. Some actions cannot be undone.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-trans-blue" />
              <div>
                <p className="text-sm text-brand-navy/70">Total Users</p>
                <p className="text-2xl font-bold text-brand-navy">{users?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Download className="w-8 h-8 text-trans-pink" />
              <div>
                <p className="text-sm text-brand-navy/70">Export Requests</p>
                <p className="text-2xl font-bold text-brand-navy">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-brand-navy/70">Deletion Requests</p>
                <p className="text-2xl font-bold text-brand-navy">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geocoding Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-navy">Venue Location Management</CardTitle>
        </CardHeader>
        <CardContent>
          <GeocodeVenues />
        </CardContent>
      </Card>

      {/* User Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-navy">User Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-navy/50 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Data Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
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
                        <Badge variant="secondary" className="text-xs mt-1">
                          Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-brand-navy/70">
                        {new Date(user.created_at).toLocaleDateString('en-GB')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportData(user.id)}
                          disabled={exportUserDataMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deleteUserDataMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User Data</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will permanently delete all user data including profile, 
                                reviews, and applications. This action cannot be undone. 
                                <br /><br />
                                <strong>Note:</strong> You will need to manually delete the user from 
                                the Supabase Auth dashboard to complete the deletion.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteData(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Data
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

export default DataManagement;