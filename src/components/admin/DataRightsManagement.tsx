import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Clock, CheckCircle, XCircle, AlertCircle, Download, Trash2, Eye, Edit, Shield, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface DataRightsRequest {
  id: string;
  email: string;
  request_type: string;
  details: string | null;
  status: string;
  processed_by: string | null;
  processed_at: string | null;
  response_notes: string | null;
  created_at: string;
  updated_at: string;
}

const DataRightsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DataRightsRequest | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [viewingDetails, setViewingDetails] = useState<DataRightsRequest | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const populateEmailsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('populate-profile-emails');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Emails Updated",
        description: `Successfully updated ${data.profiles_updated} profiles with emails.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile emails. Please try again.",
        variant: "destructive",
      });
      console.error('Populate emails error:', error);
    }
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['data-rights-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_rights_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DataRightsRequest[];
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { error } = await supabase
        .from('data_rights_requests')
        .update({
          status,
          response_notes: notes,
          processed_by: user?.id,
          processed_at: status !== 'pending' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Request Updated",
        description: "The data rights request has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['data-rights-requests'] });
      setSelectedRequest(null);
      setResponseNotes('');
      setNewStatus('');
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update the request. Please try again.",
        variant: "destructive",
      });
      console.error('Update error:', error);
    }
  });

  const exportUserDataMutation = useMutation({
    mutationFn: async (email: string) => {
      // Get user-specific data filtered by email
      const [profiles, reviews, venues] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('email', email),
        supabase
          .from('venue_reviews')
          .select('*, profiles!inner(email)')
          .eq('profiles.email', email),
        supabase
          .from('venue_applications')
          .select('*')
          .eq('email', email)
      ]);

      const userData = {
        email,
        profiles: profiles.data || [],
        reviews: reviews.data || [],
        venue_applications: venues.data || [],
        exported_at: new Date().toISOString(),
        export_type: 'GDPR_DATA_EXPORT_REQUEST'
      };

      return userData;
    },
    onSuccess: (data, email) => {
      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-export-${email}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "User data has been exported successfully.",
      });
    }
  });

  const filteredRequests = requests?.filter(request => 
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    request.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><AlertCircle className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <Eye className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'correct': return <Edit className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'portability': return <FileText className="w-4 h-4" />;
      case 'restrict': case 'object': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'access': return 'Access Data';
      case 'download': return 'Download Data';
      case 'correct': return 'Correct Data';
      case 'delete': return 'Delete Data';
      case 'portability': return 'Data Portability';
      case 'restrict': return 'Restrict Processing';
      case 'object': return 'Object to Processing';
      default: return type;
    }
  };

  const handleProcess = (request: DataRightsRequest) => {
    setSelectedRequest(request);
    setResponseNotes(request.response_notes || '');
    setNewStatus(request.status);
  };

  const handleUpdate = () => {
    if (!selectedRequest) return;
    
    updateRequestMutation.mutate({
      id: selectedRequest.id,
      status: newStatus,
      notes: responseNotes
    });
  };

  const generateAccessReportMutation = useMutation({
    mutationFn: async (email: string) => {
      // Get user-specific data by filtering on email
      const [profiles, reviews, venues] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('email', email),
        supabase
          .from('venue_reviews')
          .select('*, profiles!inner(email)')
          .eq('profiles.email', email),
        supabase
          .from('venue_applications')
          .select('*')
          .eq('email', email)
      ]);

      // Filter the data to only include records for this user
      const userProfiles = profiles.data || [];
      const userReviews = reviews.data || [];

      const accessReport = {
        email,
        report_type: 'GDPR_ACCESS_REQUEST',
        generated_at: new Date().toISOString(),
        data_summary: {
          total_profiles: userProfiles.length,
          total_reviews: userReviews.length,
          total_applications: venues.data?.length || 0, // This is already filtered by email
        },
        readable_summary: `
Data Access Report for ${email}
Generated on: ${new Date().toLocaleDateString()}

SUMMARY:
- Profiles: ${userProfiles.length} records
- Reviews: ${userReviews.length} records  
- Venue Applications: ${venues.data?.length || 0} records

This report provides an overview of personal data we process about you.
For a complete data export, please submit a "Download Data" request.
        `.trim()
      };

      return accessReport;
    },
    onSuccess: (data, email) => {
      // Download as readable text file
      const blob = new Blob([data.readable_summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `access-report-${email}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Access Report Generated",
        description: "Readable access report has been generated for the user.",
      });
    }
  });

  const handleQuickAction = async (request: DataRightsRequest, action: string) => {
    if (action === 'access' && request.request_type === 'access') {
      generateAccessReportMutation.mutate(request.email);
      updateRequestMutation.mutate({
        id: request.id,
        status: 'completed',
        notes: 'Access report generated and provided to user'
      });
    } else if (action === 'download' && request.request_type === 'download') {
      exportUserDataMutation.mutate(request.email);
      updateRequestMutation.mutate({
        id: request.id,
        status: 'completed',
        notes: 'Complete data export generated and provided to user'
      });
    } else {
      // Auto-update status for other quick actions
      updateRequestMutation.mutate({
        id: request.id,
        status: 'in_progress',
        notes: 'Processing request'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-brand-navy" />
          <h2 className="text-2xl font-bold text-brand-navy">Data Rights Requests</h2>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-brand-navy/70">Loading requests...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="w-6 h-6 text-brand-navy" />
        <h2 className="text-2xl font-bold text-brand-navy">Data Rights Requests</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-brand-navy/70">Pending</p>
                <p className="text-2xl font-bold text-brand-navy">
                  {filteredRequests?.filter(r => r.status === 'pending').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-brand-navy/70">In Progress</p>
                <p className="text-2xl font-bold text-brand-navy">
                  {filteredRequests?.filter(r => r.status === 'in_progress').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-brand-navy/70">Completed</p>
                <p className="text-2xl font-bold text-brand-navy">
                  {filteredRequests?.filter(r => r.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-trans-blue" />
              <div>
                <p className="text-sm text-brand-navy/70">Total Requests</p>
                <p className="text-2xl font-bold text-brand-navy">{filteredRequests?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-navy">GDPR Data Rights Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-navy/50 w-4 h-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => populateEmailsMutation.mutate()}
              disabled={populateEmailsMutation.isPending}
              variant="outline"
            >
              Sync Profile Emails
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Additional Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium text-brand-navy">{request.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRequestTypeIcon(request.request_type)}
                        <span className="text-brand-navy">{getRequestTypeLabel(request.request_type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.details ? (
                        <div className="text-sm text-brand-navy max-w-xs">
                          <div className="truncate mb-1">
                            {request.details}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewingDetails(request)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Full
                          </Button>
                        </div>
                      ) : (
                        <span className="text-brand-navy/50 text-sm italic">No additional details</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-brand-navy/70">
                        {new Date(request.created_at).toLocaleDateString('en-GB')}
                      </div>
                      <div className="text-xs text-brand-navy/50">
                        {new Date(request.created_at).toLocaleTimeString('en-GB')}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex space-x-2">
                         {request.request_type === 'access' && request.status === 'pending' && (
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleQuickAction(request, 'access')}
                             disabled={generateAccessReportMutation.isPending}
                           >
                             <Eye className="w-4 h-4 mr-1" />
                             Generate Report
                           </Button>
                         )}
                         
                         {request.request_type === 'download' && request.status === 'pending' && (
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleQuickAction(request, 'download')}
                             disabled={exportUserDataMutation.isPending}
                           >
                             <Download className="w-4 h-4 mr-1" />
                             Export Data
                           </Button>
                         )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProcess(request)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Process
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Process Data Rights Request</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-brand-navy">Status</label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-brand-navy">Response Notes</label>
                                <Textarea
                                  value={responseNotes}
                                  onChange={(e) => setResponseNotes(e.target.value)}
                                  placeholder="Add notes about how this request was processed..."
                                  rows={3}
                                />
                              </div>
                              
                              <Button 
                                onClick={handleUpdate} 
                                disabled={updateRequestMutation.isPending}
                                className="w-full"
                              >
                                Update Request
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredRequests?.length === 0 && (
              <div className="text-center py-8 text-brand-navy/70">
                No data rights requests found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Details Modal */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Additional Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-brand-navy">Request from:</label>
              <p className="text-brand-navy">{viewingDetails?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-navy">Request Type:</label>
              <div className="flex items-center gap-2 mt-1">
                {viewingDetails && getRequestTypeIcon(viewingDetails.request_type)}
                <span className="text-brand-navy">
                  {viewingDetails && getRequestTypeLabel(viewingDetails.request_type)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-navy">Additional Details:</label>
              <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                <p className="text-brand-navy whitespace-pre-wrap">
                  {viewingDetails?.details || 'No additional details provided.'}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataRightsManagement;