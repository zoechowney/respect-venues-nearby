import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, Phone, Calendar, Building, User, MessageSquare } from 'lucide-react';
import { useSponsorApplications, useUpdateSponsorApplicationStatus } from '@/hooks/useSponsorApplications';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const SponsorApplicationsManagement = () => {
  const { data: applications, isLoading, error } = useSponsorApplications();
  const updateStatusMutation = useUpdateSponsorApplicationStatus();
  const { toast } = useToast();

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast({
        title: 'Status Updated',
        description: `Application status has been updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update application status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-brand-navy/70">Loading sponsor applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading sponsor applications</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-brand-navy/30 mb-4" />
        <h3 className="text-lg font-medium text-brand-navy mb-2">No Sponsor Applications</h3>
        <p className="text-brand-navy/70">No sponsor applications have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-navy">Sponsor Applications</h2>
        <div className="text-sm text-brand-navy/70">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <Card key={application.id} className="border-trans-blue/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-brand-navy flex items-center">
                  <Building className="w-5 h-5 mr-2 text-trans-blue" />
                  {application.company_name}
                </CardTitle>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-brand-navy/70">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">Contact:</span>
                    <span className="ml-2">{application.contact_name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-brand-navy/70">
                    <Mail className="w-4 h-4 mr-2" />
                    <a 
                      href={`mailto:${application.email}`}
                      className="text-trans-blue hover:text-trans-pink transition-colors"
                    >
                      {application.email}
                    </a>
                  </div>

                  {application.phone && (
                    <div className="flex items-center text-sm text-brand-navy/70">
                      <Phone className="w-4 h-4 mr-2" />
                      <a 
                        href={`tel:${application.phone}`}
                        className="text-trans-blue hover:text-trans-pink transition-colors"
                      >
                        {application.phone}
                      </a>
                    </div>
                  )}

                  {application.website && (
                    <div className="flex items-center text-sm text-brand-navy/70">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <a 
                        href={application.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-trans-blue hover:text-trans-pink transition-colors"
                      >
                        {application.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-brand-navy/70">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Submitted:</span>
                    <span className="ml-2">
                      {format(new Date(application.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              {application.message && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-1 text-brand-navy/50" />
                    <div>
                      <p className="text-sm font-medium text-brand-navy mb-1">Message:</p>
                      <p className="text-sm text-brand-navy/70">{application.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {application.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(application.id, 'contacted')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Mark as Contacted
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(application.id, 'approved')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      disabled={updateStatusMutation.isPending}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      Reject
                    </Button>
                  </>
                )}
                
                {application.status === 'contacted' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(application.id, 'approved')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      disabled={updateStatusMutation.isPending}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(application.id, 'pending')}
                      disabled={updateStatusMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      Back to Pending
                    </Button>
                  </>
                )}

                {(application.status === 'approved' || application.status === 'rejected') && (
                  <Button
                    onClick={() => handleStatusUpdate(application.id, 'pending')}
                    disabled={updateStatusMutation.isPending}
                    variant="outline"
                    size="sm"
                  >
                    Back to Pending
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SponsorApplicationsManagement;