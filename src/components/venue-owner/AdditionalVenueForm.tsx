import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { detectSpam, sanitizeText } from '@/lib/security';
import { Plus } from 'lucide-react';

interface AdditionalVenueFormProps {
  venueOwnerId: string;
  onVenueAdded: () => void;
}

interface FormData {
  businessName: string;
  businessType: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  signStyle: string;
  features: string[];
}

const AdditionalVenueForm: React.FC<AdditionalVenueFormProps> = ({ venueOwnerId, onVenueAdded }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    signStyle: '',
    features: []
  });

  const availableFeatures = [
    'Wheelchair Accessible', 'Gender Neutral Toilets', 'Staff Training',
    'Safe Space Policy', 'LGBTQ+ Events', 'Free WiFi', 'Parking Available', 'Family Friendly'
  ];

  const resetForm = () => {
    setFormData({
      businessName: '',
      businessType: '',
      address: '',
      phone: '',
      website: '',
      description: '',
      signStyle: '',
      features: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Detect spam in description
    if (formData.description) {
      const spamResult = detectSpam(formData.description);
      if (spamResult.isSpam) {
        toast({
          title: "Content Rejected",
          description: "Your description contains inappropriate content. Please revise and try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Get venue owner's contact info for the application
      const { data: venueOwner, error: ownerError } = await supabase
        .from('venue_owners')
        .select('contact_name, email')
        .eq('id', venueOwnerId)
        .single();

      if (ownerError) {
        throw new Error('Failed to get venue owner information');
      }

      // Create venue application
      const { error: applicationError } = await supabase
        .from('venue_applications')
        .insert({
          business_name: sanitizeText(formData.businessName),
          business_type: formData.businessType,
          contact_name: venueOwner.contact_name,
          email: venueOwner.email,
          phone: formData.phone || null,
          address: sanitizeText(formData.address),
          website: formData.website || null,
          description: formData.description ? sanitizeText(formData.description) : null,
          sign_style: formData.signStyle || null,
          agree_to_terms: true, // Existing venue owners already agreed
          agree_to_training: true, // Existing venue owners already agreed
          venue_owner_id: venueOwnerId
        });

      if (applicationError) {
        throw applicationError;
      }

      toast({
        title: "Application Submitted",
        description: "Your additional venue application has been submitted for admin review.",
      });

      resetForm();
      setIsOpen(false);
      onVenueAdded();

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Venue
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-navy">Add Additional Venue</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">
                  Business Name *
                </label>
                <Input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Enter business name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">
                  Business Type *
                </label>
                <Select 
                  value={formData.businessType} 
                  onValueChange={(value) => setFormData({...formData, businessType: value})}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white border shadow-lg">
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

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Business Address *
              </label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full business address"
                rows={2}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone number"
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
                  placeholder="https://yourwebsite.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Tell us about your business
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of your business and commitment to inclusivity"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Preferred Sign Style
              </label>
              <Select 
                value={formData.signStyle} 
                onValueChange={(value) => setFormData({...formData, signStyle: value})}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a sign style" />
                </SelectTrigger>
                <SelectContent className="z-[9999] bg-white border shadow-lg">
                  <SelectItem value="classic">Classic Blue & White</SelectItem>
                  <SelectItem value="rainbow">Rainbow Pride</SelectItem>
                  <SelectItem value="minimalist">Minimalist Black</SelectItem>
                  <SelectItem value="custom">Custom Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-3">
                Features & Accessibility
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableFeatures.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={feature} className="text-sm text-brand-navy/80">{feature}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsOpen(false);
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.businessName || !formData.businessType || !formData.address}
                className="flex-1 bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdditionalVenueForm;