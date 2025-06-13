
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  signStyle: string;
  agreeToTerms: boolean;
  agreeToTraining: boolean;
}

const VenueRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    signStyle: '',
    agreeToTerms: false,
    agreeToTraining: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('venue_applications')
        .insert({
          business_name: formData.businessName,
          business_type: formData.businessType,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address,
          website: formData.website || null,
          description: formData.description || null,
          sign_style: formData.signStyle || null,
          agree_to_terms: formData.agreeToTerms,
          agree_to_training: formData.agreeToTraining
        });

      if (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Error",
          description: "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Application Submitted!",
          description: "Thank you for joining the movement. We'll review your application and get back to you soon.",
        });
        
        // Reset form
        setFormData({
          businessName: '',
          businessType: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          description: '',
          signStyle: '',
          agreeToTerms: false,
          agreeToTraining: false
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-trans-blue/20">
      <CardHeader>
        <CardTitle className="text-brand-navy">Business Registration</CardTitle>
        <p className="text-sm text-brand-navy/70">Fill out the form below to join our network</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Business Name *
              </label>
              <Input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="Enter your business name"
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
                <SelectContent>
                  <SelectItem value="pub">Pub</SelectItem>
                  <SelectItem value="restaurant">Restaurant/Café</SelectItem>
                  <SelectItem value="shop">Shop/Retail</SelectItem>
                  <SelectItem value="gym">Gym/Fitness</SelectItem>
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
                Contact Name *
              </label>
              <Input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                placeholder="Your name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>
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
              <SelectContent>
                <SelectItem value="classic">Classic Blue & White</SelectItem>
                <SelectItem value="rainbow">Rainbow Pride</SelectItem>
                <SelectItem value="minimalist">Minimalist Black</SelectItem>
                <SelectItem value="custom">Custom Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                disabled={isSubmitting}
              />
              <label htmlFor="terms" className="text-sm text-brand-navy/70">
                I agree to the terms and conditions and commit to providing a welcoming environment for all customers
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="training"
                checked={formData.agreeToTraining}
                onCheckedChange={(checked) => setFormData({...formData, agreeToTraining: checked as boolean})}
                disabled={isSubmitting}
              />
              <label htmlFor="training" className="text-sm text-brand-navy/70">
                I agree to complete the basic inclusivity training materials provided
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy" 
            size="lg"
            disabled={!formData.agreeToTerms || !formData.agreeToTraining || isSubmitting}
          >
            <Mail className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VenueRegistrationForm;
