
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVenueOwnerAuth } from '@/contexts/VenueOwnerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VenueUpdateFormProps {
  venue: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const VenueUpdateForm: React.FC<VenueUpdateFormProps> = ({
  venue,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { venueOwner } = useVenueOwnerAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    sign_style: ''
  });

  useEffect(() => {
    if (venue) {
      setFormData({
        business_name: venue.business_name || '',
        business_type: venue.business_type || '',
        contact_name: venue.contact_name || '',
        email: venue.email || '',
        phone: venue.phone || '',
        address: venue.address || '',
        website: venue.website || '',
        description: venue.description || '',
        sign_style: venue.sign_style || ''
      });
    }
  }, [venue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueOwner?.id || !venue?.id) return;

    setIsSubmitting(true);

    try {
      // Submit pending changes
      const { error: changesError } = await supabase
        .from('venue_pending_changes')
        .insert({
          venue_id: venue.id,
          venue_owner_id: venueOwner.id,
          ...formData
        });

      if (changesError) {
        throw changesError;
      }

      // Deactivate the venue until admin approval
      const { error: venueError } = await supabase
        .from('venues')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString() 
        })
        .eq('id', venue.id);

      if (venueError) {
        throw venueError;
      }

      onSubmit();
    } catch (error) {
      console.error('Error submitting venue update:', error);
      toast({
        title: "Error",
        description: "Failed to submit venue update. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand-navy">Update Venue Information</DialogTitle>
          <p className="text-sm text-brand-navy/70">
            Changes will be reviewed by administrators before going live. Your venue will be temporarily deactivated during review.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Business Name
              </label>
              <Input
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Business Type
              </label>
              <Select 
                value={formData.business_type} 
                onValueChange={(value) => setFormData({...formData, business_type: value})}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pub">Pub / bar</SelectItem>
                  <SelectItem value="restaurant">Restaurant / café</SelectItem>
                  <SelectItem value="shop">Shop / retail</SelectItem>
                  <SelectItem value="gym">Gym / fitness</SelectItem>
                  <SelectItem value="office">Office / workplace</SelectItem>
                  <SelectItem value="cinema">Cinema / theatre</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Contact Name
              </label>
              <Input
                value={formData.contact_name}
                onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">
              Address
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">
              Sign Style
            </label>
            <Select 
              value={formData.sign_style} 
              onValueChange={(value) => setFormData({...formData, sign_style: value})}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic Blue & White</SelectItem>
                <SelectItem value="rainbow">Rainbow Pride</SelectItem>
                <SelectItem value="minimalist">Minimalist Black</SelectItem>
                <SelectItem value="custom">Custom Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VenueUpdateForm;
