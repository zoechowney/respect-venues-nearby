
import React, { useState } from 'react';
import { Heart, Users, CheckCircle, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const JoinMovement = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Rest with Respect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/map" className="text-gray-700 hover:text-blue-600 transition-colors">Find Venues</Link>
              <Link to="/directory" className="text-gray-700 hover:text-blue-600 transition-colors">Directory</Link>
              <Link to="/join" className="text-blue-600 font-medium">Join Movement</Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join the Movement</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help create more inclusive spaces by joining our network of transgender-friendly establishments. 
            Get your free signage pack and become part of a welcoming community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>What You Get</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm">Free high-quality door signs with QR codes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm">Listing on our website and app</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm">Access to training materials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm">Marketing support materials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm">Community of like-minded businesses</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span>Sign Styles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Choose from our range of professional sign designs:</p>
                <ul className="text-sm space-y-1">
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
            <Card>
              <CardHeader>
                <CardTitle>Business Registration</CardTitle>
                <p className="text-sm text-gray-600">Fill out the form below to join our network</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        placeholder="Enter your business name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type *
                      </label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address *
                    </label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Full business address"
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tell us about your business
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of your business and commitment to inclusivity"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Sign Style
                    </label>
                    <Select value={formData.signStyle} onValueChange={(value) => setFormData({...formData, signStyle: value})}>
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
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the terms and conditions and commit to providing a welcoming environment for all customers
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="training"
                        checked={formData.agreeToTraining}
                        onCheckedChange={(checked) => setFormData({...formData, agreeToTraining: checked as boolean})}
                      />
                      <label htmlFor="training" className="text-sm text-gray-600">
                        I agree to complete the basic inclusivity training materials provided
                      </label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={!formData.agreeToTerms || !formData.agreeToTraining}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Submit Application
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
