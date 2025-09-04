
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import LoadingSpinner from '@/components/LoadingSpinner';
import bcrypt from 'bcryptjs';
import { useRateLimit, RATE_LIMITS } from '@/lib/rateLimiter';
import { detectSpam, sanitizeText } from '@/lib/security';

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
  features: string[];
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToTraining: boolean;
}

const VenueRegistrationForm = () => {
  const { toast } = useToast();
  const { showVenueApplicationSubmitted, showServerError } = useToastNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkLimit } = useRateLimit('venue_application', RATE_LIMITS.VENUE_APPLICATION);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    features: [],
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToTraining: false
  });

  const availableFeatures = [
    'Wheelchair Accessible', 'Gender Neutral Toilets', 'LGBTQ+ Events', 'Free WiFi'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check rate limiting
    const rateLimitResult = checkLimit();
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime);
      toast({
        title: "Too Many Applications",
        description: `You've submitted too many applications recently. Please try again after ${resetTime.toLocaleTimeString()}.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

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
      // Check if email already exists
      const { data: existingOwner, error: checkError } = await supabase
        .from('venue_owners')
        .select('id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing email:', checkError);
        toast({
          title: "Error",
          description: "Failed to verify email. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      let venueOwnerId;
      
      if (existingOwner) {
        // Email already exists, use existing owner ID
        venueOwnerId = existingOwner.id;
        toast({
          title: "Using Existing Account",
          description: "We found an existing account with this email. Your application will be linked to it.",
          variant: "default",
        });
      } else {
        // Create new venue owner account
        const passwordHash = await bcrypt.hash(formData.password, 10);
        
        const { data: venueOwner, error: ownerError } = await supabase
          .from('venue_owners')
          .insert({
            email: formData.email,
            password_hash: passwordHash,
            business_name: formData.businessName,
            contact_name: formData.contactName
          })
          .select()
          .single();

        if (ownerError) {
          console.error('Error creating venue owner:', ownerError);
          toast({
            title: "Error",
            description: "Failed to create venue owner account. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        venueOwnerId = venueOwner.id;
      }

      // Create venue application with venue owner reference (sanitize text inputs)
      const { error: applicationError } = await supabase
        .from('venue_applications')
        .insert({
          business_name: sanitizeText(formData.businessName),
          business_type: formData.businessType,
          contact_name: sanitizeText(formData.contactName),
          email: formData.email,
          phone: formData.phone || null,
          address: sanitizeText(formData.address),
          website: formData.website || null,
          description: formData.description ? sanitizeText(formData.description) : null,
          sign_style: formData.signStyle || null,
          features: formData.features.length > 0 ? formData.features : null,
          agree_to_terms: formData.agreeToTerms,
          agree_to_training: formData.agreeToTraining,
          venue_owner_id: venueOwnerId
        });

      if (applicationError) {
        console.error('Error submitting application:', applicationError);
        toast({
          title: "Error",
          description: "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      } else {
        showVenueApplicationSubmitted();
        
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
          features: [],
          password: '',
          confirmPassword: '',
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

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <Card className="border-trans-blue/20">
      <CardHeader>
        <CardTitle className="text-brand-navy">Business Registration</CardTitle>
        <p className="text-sm text-brand-navy/70">Fill out the form below to join our network and create your venue owner account</p>
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

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-3">
              Features & Accessibility
            </label>
            <p className="text-xs text-brand-navy/60 mb-3">
              Select all features and accessibility options your venue offers
            </p>
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

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-brand-navy mb-4">Create Your Venue Owner Account</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Create a password (min 8 characters)"
                    required
                    disabled={isSubmitting}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-navy/40"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    required
                    disabled={isSubmitting}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-navy/40"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-navy/60 mt-2">
              You'll use this email and password to log in and manage your venue information after approval.
            </p>
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
                I agree to the{' '}
                <Link to="/terms-of-service" className="text-trans-blue hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </Link>
                , the{' '}
                <Link to="/code-of-conduct" className="text-trans-blue hover:underline" target="_blank" rel="noopener noreferrer">
                  Code of Conduct
                </Link>
                , and commit to providing a welcoming environment for all customers
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
            disabled={!formData.agreeToTerms || !formData.agreeToTraining || !formData.password || !formData.confirmPassword || isSubmitting}
          >
            <Mail className="w-5 h-5 mr-2" />
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Application & Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VenueRegistrationForm;
