
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VenueEditModal from './VenueEditModal';

const VenuesManagement = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venue_applications')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast({
        title: "Error",
        description: "Failed to fetch venues",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleEdit = (venue: any) => {
    setSelectedVenue(venue);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (venueId: string) => {
    if (!confirm('Are you sure you want to remove this venue? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('venue_applications')
        .delete()
        .eq('id', venueId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Venue removed successfully",
      });

      fetchVenues();
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast({
        title: "Error",
        description: "Failed to remove venue",
        variant: "destructive",
      });
    }
  };

  const handleVenueUpdated = () => {
    fetchVenues();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-navy/60">Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">Approved Venues ({venues.length})</h2>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-brand-navy/60">No approved venues found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="border-trans-blue/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-brand-navy">{venue.business_name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="bg-trans-blue/20 text-trans-blue">
                        {venue.business_type}
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Approved
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(venue)}
                      className="border-trans-blue text-trans-blue hover:bg-trans-blue/10"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(venue.id)}
                      className="border-red-500 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-brand-navy/70">Address</p>
                    <p className="text-brand-navy">{venue.address}</p>
                  </div>
                  
                  {venue.phone && (
                    <div>
                      <p className="text-sm font-medium text-brand-navy/70">Phone</p>
                      <p className="text-brand-navy">{venue.phone}</p>
                    </div>
                  )}
                  
                  {venue.website && (
                    <div>
                      <p className="text-sm font-medium text-brand-navy/70">Website</p>
                      <a 
                        href={venue.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-trans-blue hover:underline flex items-center"
                      >
                        {venue.website}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                  
                  {venue.description && (
                    <div>
                      <p className="text-sm font-medium text-brand-navy/70">Description</p>
                      <p className="text-brand-navy text-sm">{venue.description}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-brand-navy/50">
                    Applied: {new Date(venue.created_at).toLocaleDateString()}
                    {venue.updated_at && venue.updated_at !== venue.created_at && (
                      <span> • Updated: {new Date(venue.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <VenueEditModal
        venue={selectedVenue}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVenue(null);
        }}
        onVenueUpdated={handleVenueUpdated}
      />
    </div>
  );
};

export default VenuesManagement;
