import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, Edit, Clock, CheckCircle, AlertTriangle, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useVenueOwnerAuth } from '@/contexts/VenueOwnerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import VenueUpdateForm from '@/components/venue-owner/VenueUpdateForm';
import VenueOwnerReviews from '@/components/venue-owner/VenueOwnerReviews';
import MobileVenueOwnerReviews from '@/components/venue-owner/MobileVenueOwnerReviews';
import AdditionalVenueForm from '@/components/venue-owner/AdditionalVenueForm';

const VenueOwnerDashboard = () => {
  const { venueOwner, signOut, loading } = useVenueOwnerAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [venues, setVenues] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not signed in
  if (!venueOwner && !loading) {
    return <Navigate to="/venue-owner/auth" replace />;
  }

  useEffect(() => {
    if (venueOwner?.id) {
      fetchVenueData();
    }
  }, [venueOwner?.id]);

  const fetchVenueData = async () => {
    if (!venueOwner?.id) return;

    try {
      // Fetch venue applications
      const { data: appsData, error: appsError } = await supabase
        .from('venue_applications')
        .select('*')
        .eq('venue_owner_id', venueOwner.id)
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;
      setApplications(appsData || []);

      // Fetch live venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .eq('venue_owner_id', venueOwner.id)
        .order('published_at', { ascending: false });

      if (venuesError) throw venuesError;
      setVenues(venuesData || []);

      // Fetch pending changes
      const { data: changesData, error: changesError } = await supabase
        .from('venue_pending_changes')
        .select('*')
        .eq('venue_owner_id', venueOwner.id)
        .order('submitted_at', { ascending: false });

      if (changesError) throw changesError;
      setPendingChanges(changesData || []);

    } catch (error) {
      console.error('Error fetching venue data:', error);
      toast({
        title: "Error",
        description: "Failed to load your venue data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVenue = (venue: any) => {
    setSelectedVenue(venue);
    setIsUpdateFormOpen(true);
  };

  const handleUpdateSubmitted = () => {
    setIsUpdateFormOpen(false);
    setSelectedVenue(null);
    fetchVenueData();
    toast({
      title: "Update Submitted",
      description: "Your venue update has been submitted for admin approval. Your venue will be temporarily deactivated until approved.",
    });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/10 flex items-center justify-center">
        <div className="text-brand-navy">Loading...</div>
      </div>
    );
  }

  const MobileNavigation = () => (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-brand-navy truncate">
        {venueOwner?.contact_name}
      </span>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-brand-navy">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          <div className="flex flex-col space-y-4 mt-8">
            <div className="flex items-center space-x-3 pb-4 border-b">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-8 w-auto" />
              <span className="font-bold text-brand-navy">Dashboard</span>
            </div>
            <p className="text-sm text-brand-navy/70">
              Welcome, {venueOwner?.contact_name}
            </p>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="justify-start text-brand-navy border-brand-navy/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/10">
      {/* Navigation */}
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className={`font-bold text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {isMobile ? 'Dashboard' : 'Venue Owner Dashboard'}
              </span>
            </Link>
            
            {isMobile ? (
              <MobileNavigation />
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-brand-navy">
                  Welcome, {venueOwner?.contact_name}
                </span>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="text-brand-navy border-brand-navy/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-${isMobile ? '4' : '8'}`}>
        <div className={`mb-${isMobile ? '6' : '8'} flex justify-between items-start`}>
          <div>
            <h1 className={`font-bold text-brand-navy mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              {isMobile ? 'Manage Venues' : 'Venue Management Dashboard'}
            </h1>
            <p className="text-brand-navy/70 text-sm">
              {isMobile ? 'Track applications and respond to reviews' : 'Manage your venue information, track applications, and respond to reviews'}
            </p>
          </div>
          {venueOwner?.id && (
            <AdditionalVenueForm 
              venueOwnerId={venueOwner.id} 
              onVenueAdded={fetchVenueData}
            />
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-2 ${isMobile ? 'h-12' : ''}`}>
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Applications Status */}
            {applications.length > 0 && (
              <div>
                <h2 className={`font-semibold text-brand-navy mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Application Status
                </h2>
                <div className="grid gap-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="border-trans-blue/20">
                      <CardHeader className={isMobile ? 'pb-3' : ''}>
                        <div className={`flex justify-between items-start ${isMobile ? 'flex-col space-y-2' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <CardTitle className={`text-brand-navy ${isMobile ? 'text-base' : 'text-lg'}`}>
                              {app.business_name}
                            </CardTitle>
                            <p className="text-sm text-brand-navy/70">{app.business_type}</p>
                          </div>
                          <Badge variant={
                            app.status === 'published' ? 'default' :
                            app.status === 'approved' ? 'secondary' :
                            app.status === 'rejected' ? 'destructive' : 'outline'
                          }>
                            {app.status === 'published' ? 'Live' : 
                             app.status === 'approved' ? 'Approved - Publishing Soon' :
                             app.status === 'rejected' ? 'Rejected' : 'Under Review'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-brand-navy/70">
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        {app.status === 'approved' && (
                          <p className="text-sm text-trans-blue mt-2">
                            Your application has been approved! It will be published to the live directory soon.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Live Venues */}
            {venues.length > 0 && (
              <div>
                <h2 className={`font-semibold text-brand-navy mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Your Live Venues
                </h2>
                <div className="grid gap-4">
                  {venues.map((venue) => (
                    <Card key={venue.id} className={`border-trans-blue/20 ${!venue.is_active ? 'opacity-60' : ''}`}>
                      <CardHeader className={isMobile ? 'pb-3' : ''}>
                        <div className={`flex justify-between items-start ${isMobile ? 'flex-col space-y-3' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <CardTitle className={`text-brand-navy ${isMobile ? 'text-base' : 'text-lg'}`}>
                              {venue.business_name}
                            </CardTitle>
                            <p className="text-sm text-brand-navy/70">
                              {venue.business_type} • {venue.address}
                            </p>
                          </div>
                          <div className={`flex items-center space-x-2 ${isMobile ? 'w-full justify-between' : ''}`}>
                            <Badge variant={venue.is_active ? "default" : "secondary"}>
                              {venue.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateVenue(venue)}
                              className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className={`flex items-center justify-between text-sm text-brand-navy/70 ${isMobile ? 'flex-col items-start space-y-1' : ''}`}>
                          <span>Published: {new Date(venue.published_at).toLocaleDateString()}</span>
                          <span>Rating: {venue.rating > 0 ? `${venue.rating}/5` : 'No rating'} • {venue.reviews_count} reviews</span>
                        </div>
                        {!venue.is_active && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-center text-sm text-yellow-800">
                              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                              This venue is temporarily inactive pending admin approval of recent changes.
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Changes */}
            {pendingChanges.length > 0 && (
              <div>
                <h2 className={`font-semibold text-brand-navy mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Pending Updates
                </h2>
                <div className="grid gap-4">
                  {pendingChanges.map((change) => (
                    <Card key={change.id} className="border-orange-200 bg-orange-50/30">
                      <CardHeader className={isMobile ? 'pb-3' : ''}>
                        <div className={`flex justify-between items-start ${isMobile ? 'flex-col space-y-2' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <CardTitle className={`text-brand-navy ${isMobile ? 'text-base' : 'text-lg'}`}>
                              {change.business_name}
                            </CardTitle>
                            <p className="text-sm text-brand-navy/70">Update submitted for review</p>
                          </div>
                          <Badge variant="outline" className="border-orange-500 text-orange-700">
                            <Clock className="w-3 h-3 mr-1" />
                            {change.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-brand-navy/70">
                          Submitted: {new Date(change.submitted_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {applications.length === 0 && venues.length === 0 && (
              <div className="text-center py-12">
                <h3 className={`font-medium text-brand-navy mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  No venues found
                </h3>
                <p className="text-brand-navy/70 mb-6 text-sm px-4">
                  You haven't registered any venues yet. Get started by adding your first venue.
                </p>
                <Link to="/join">
                  <Button className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy">
                    Register Your Venue
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {venueOwner?.id && (
              isMobile ? (
                <MobileVenueOwnerReviews venueOwnerId={venueOwner.id} />
              ) : (
                <VenueOwnerReviews venueOwnerId={venueOwner.id} />
              )
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Update Form Modal */}
      {selectedVenue && (
        <VenueUpdateForm
          venue={selectedVenue}
          isOpen={isUpdateFormOpen}
          onClose={() => {
            setIsUpdateFormOpen(false);
            setSelectedVenue(null);
          }}
          onSubmit={handleUpdateSubmitted}
        />
      )}
    </div>
  );
};

export default VenueOwnerDashboard;
