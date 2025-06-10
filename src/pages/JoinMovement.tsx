
import React, { useState } from 'react';
import { Heart, Users, CheckCircle, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const JoinMovement = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      {/* Navigation */}
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/47c34702-3d2a-438b-ade5-4708bdf5068f.png" alt="Rest with Respect Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-brand-navy">Rest with Respect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
              <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
              <Link to="/join" className="text-trans-blue font-medium">Join Movement</Link>
              <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Users className="w-16 h-16 text-trans-blue mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-brand-navy mb-4">Join the Movement</h1>
          <p className="text-xl text-brand-navy/80 max-w-2xl mx-auto">
            Help create more inclusive spaces by joining our network of transgender-friendly establishments. 
            Get your free signage pack and become part of a welcoming community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-trans-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-brand-navy">
                  <CheckCircle className="w-5 h-5 text-trans-blue" />
                  <span>What You Get</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
                  <p className="text-sm text-brand-navy/70">Free high-quality door signs with QR codes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
                  <p className="text-sm text-brand-navy/70">Listing on our website and app</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
                  <p className="text-sm text-brand-navy/70">Access to training materials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
                  <p className="text-sm text-brand-navy/70">Marketing support materials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
                  <p className="text-sm text-brand-navy/70">Community of like-minded businesses</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-trans-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-brand-navy">
                  <Download className="w-5 h-5 text-trans-pink" />
                  <span>Sign Styles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-brand-navy/70 mb-3">Choose from our range of professional sign designs:</p>
                <ul className="text-sm space-y-1 text-brand-navy/70">
                  <li>• Classic Blue & White</li>
                  <li>• Rainbow Pride</li>
                  <li>• Minimalist Black</li>
                  <li>• Custom Design Available</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Form */}
          <div className="lg:col-span-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMovement;
