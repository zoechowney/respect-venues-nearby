import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface VenueApplication {
  id: string;
  business_name: string;
  business_type: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string;
  website: string | null;
  description: string | null;
  sign_style: string | null;
  status: string;
  created_at: string;
}

const ApplicationsReview = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<VenueApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    console.log('Fetching applications...');
    try {
      const { data, error } = await supabase
        .from('venue_applications')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Applications query result:', { data, error });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch applications",
          variant: "destructive",
        });
      } else {
        console.log('Successfully fetched applications:', data?.length || 0);
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('venue_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating application:', error);
        toast({
          title: "Error",
          description: "Failed to update application status",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Application ${status} successfully`,
        });
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-navy/70">Loading applications...</div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      {pendingApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-brand-navy mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Pending Applications ({pendingApplications.length})
          </h2>
          <div className="grid gap-4">
            {pendingApplications.map((application) => (
              <Card key={application.id} className="border-trans-blue/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-brand-navy">{application.business_name}</CardTitle>
                      <p className="text-sm text-brand-navy/70 mt-1">
                        {application.business_type} • Applied {format(new Date(application.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-brand-navy/70">Contact</p>
                      <p className="text-brand-navy">{application.contact_name}</p>
                      <p className="text-brand-navy">{application.email}</p>
                      {application.phone && <p className="text-brand-navy">{application.phone}</p>}
                    </div>
                    <div>
                      <p className="text-sm text-brand-navy/70">Address</p>
                      <p className="text-brand-navy">{application.address}</p>
                      {application.website && (
                        <a 
                          href={application.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-trans-blue hover:underline flex items-center mt-1"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {application.description && (
                    <div className="mb-4">
                      <p className="text-sm text-brand-navy/70">Description</p>
                      <p className="text-brand-navy">{application.description}</p>
                    </div>
                  )}

                  {application.sign_style && (
                    <div className="mb-4">
                      <p className="text-sm text-brand-navy/70">Preferred Sign Style</p>
                      <p className="text-brand-navy capitalize">{application.sign_style.replace('-', ' ')}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => updateApplicationStatus(application.id, 'approved')}
                      disabled={processingId === application.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      disabled={processingId === application.id}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {processedApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-brand-navy mb-4">
            Recent Decisions ({processedApplications.length})
          </h2>
          <div className="grid gap-4">
            {processedApplications.slice(0, 10).map((application) => (
              <Card key={application.id} className="border-trans-blue/20">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-brand-navy">{application.business_name}</h3>
                      <p className="text-sm text-brand-navy/70">{application.business_type}</p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-navy/70">No applications found</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsReview;
