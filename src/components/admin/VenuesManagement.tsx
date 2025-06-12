
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface ApprovedVenue {
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
  created_at: string;
  updated_at: string;
}

const VenuesManagement = () => {
  const { toast } = useToast();
  const [venues, setVenues] = useState<ApprovedVenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedVenues();
  }, []);

  const fetchApprovedVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venue_applications')
        .select('*')
        .eq('status', 'approved')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved venues:', error);
        toast({
          title: "Error",
          description: "Failed to fetch approved venues",
          variant: "destructive",
        });
      } else {
        setVenues(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeApproval = async (id: string) => {
    try {
      const { error } = await supabase
        .from('venue_applications')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error revoking approval:', error);
        toast({
          title: "Error",
          description: "Failed to revoke venue approval",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Venue approval revoked. It's now back in pending status.",
        });
        fetchApprovedVenues(); // Refresh the list
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-navy/70">Loading approved venues...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand-navy">
          Approved Venues ({venues.length})
        </h2>
      </div>

      {venues.length > 0 ? (
        <div className="grid gap-4">
          {venues.map((venue) => (
            <Card key={venue.id} className="border-trans-blue/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-brand-navy">{venue.business_name}</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-brand-navy/70">
                  Approved {format(new Date(venue.updated_at), 'MMM d, yyyy')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{venue.business_type}</Badge>
                      {venue.sign_style && (
                        <Badge variant="outline" className="capitalize">
                          {venue.sign_style.replace('-', ' ')} Sign
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-brand-navy/70 mt-0.5 flex-shrink-0" />
                      <p className="text-brand-navy text-sm">{venue.address}</p>
                    </div>

                    {venue.description && (
                      <div>
                        <p className="text-sm text-brand-navy/70 mb-1">Description</p>
                        <p className="text-brand-navy text-sm">{venue.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-brand-navy/70 mb-2">Contact Information</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-brand-navy/70" />
                          <span className="text-brand-navy text-sm">{venue.contact_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-brand-navy/70" />
                          <a 
                            href={`mailto:${venue.email}`}
                            className="text-trans-blue hover:underline text-sm"
                          >
                            {venue.email}
                          </a>
                        </div>
                        {venue.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-brand-navy/70" />
                            <span className="text-brand-navy text-sm">{venue.phone}</span>
                          </div>
                        )}
                        {venue.website && (
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4 text-brand-navy/70" />
                            <a 
                              href={venue.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-trans-blue hover:underline text-sm"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => revokeApproval(venue.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Revoke Approval
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-brand-navy/70">No approved venues yet</p>
          <p className="text-brand-navy/50 text-sm mt-2">
            Venues will appear here once you approve their applications
          </p>
        </div>
      )}
    </div>
  );
};

export default VenuesManagement;
