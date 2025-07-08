import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2, Eye, Edit, Shield, FileText } from 'lucide-react';

const DataRights = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    requestType: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically send to a backend service
    toast({
      title: "Request Submitted",
      description: "We have received your data rights request and will respond within 30 days.",
    });
    setFormData({ email: '', requestType: '', details: '' });
  };

  const requestTypes = [
    { value: 'access', label: 'Access my data', icon: Eye },
    { value: 'download', label: 'Download my data', icon: Download },
    { value: 'correct', label: 'Correct my data', icon: Edit },
    { value: 'delete', label: 'Delete my data', icon: Trash2 },
    { value: 'portability', label: 'Data portability', icon: FileText },
    { value: 'restrict', label: 'Restrict processing', icon: Shield },
    { value: 'object', label: 'Object to processing', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation />
      
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`font-bold text-brand-navy ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4`}>
              Your Data Protection Rights
            </h1>
            <p className="text-brand-navy/70">
              Exercise your rights under UK GDPR and the Data Protection Act 2018
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rights Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-brand-navy">Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Eye className="w-5 h-5 text-trans-blue mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-navy">Right to Access</h3>
                        <p className="text-sm text-brand-navy/70">
                          Request a copy of the personal data we hold about you
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Download className="w-5 h-5 text-trans-blue mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-navy">Right to Portability</h3>
                        <p className="text-sm text-brand-navy/70">
                          Receive your data in a portable, machine-readable format
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Edit className="w-5 h-5 text-trans-pink mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-navy">Right to Rectification</h3>
                        <p className="text-sm text-brand-navy/70">
                          Correct inaccurate or incomplete personal data
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Trash2 className="w-5 h-5 text-trans-pink mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-navy">Right to Erasure</h3>
                        <p className="text-sm text-brand-navy/70">
                          Request deletion of your personal data ("right to be forgotten")
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-brand-navy mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-navy">Right to Restrict</h3>
                        <p className="text-sm text-brand-navy/70">
                          Limit how we process your personal data
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-brand-navy mt-1" />
                      <div>
                        <h3 className="font-medium text-brand-navy">Right to Object</h3>
                        <p className="text-sm text-brand-navy/70">
                          Object to processing of your personal data
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-brand-navy">Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brand-navy/70">Standard Requests:</span>
                      <span className="font-medium text-brand-navy">30 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-navy/70">Complex Requests:</span>
                      <span className="font-medium text-brand-navy">60 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-navy/70">Urgent Requests:</span>
                      <span className="font-medium text-brand-navy">72 hours</span>
                    </div>
                  </div>
                  <p className="text-sm text-brand-navy/70 mt-4">
                    We will acknowledge your request within 72 hours and provide regular updates on progress.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Request Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-brand-navy">Submit a Data Rights Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="requestType" className="block text-sm font-medium text-brand-navy mb-2">
                        Type of Request *
                      </label>
                      <Select 
                        value={formData.requestType} 
                        onValueChange={(value) => setFormData({ ...formData, requestType: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a request type" />
                        </SelectTrigger>
                        <SelectContent>
                          {requestTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <type.icon className="w-4 h-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="details" className="block text-sm font-medium text-brand-navy mb-2">
                        Additional Details
                      </label>
                      <Textarea
                        id="details"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Please provide any additional information about your request..."
                        rows={4}
                      />
                    </div>

                    <div className="bg-brand-navy/5 p-4 rounded-lg">
                      <p className="text-sm text-brand-navy/70">
                        <strong>Identity Verification:</strong> To protect your privacy, we may request 
                        additional verification before processing your request. This helps ensure your 
                        personal data remains secure.
                      </p>
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-brand-navy">Alternative Contact Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-brand-navy">Email</h4>
                      <p className="text-sm text-brand-navy/70">privacy@restwithrespect.org</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-navy">Subject Line</h4>
                      <p className="text-sm text-brand-navy/70">Data Protection Request - [Type of Request]</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-navy">Information Commissioner's Office</h4>
                      <p className="text-sm text-brand-navy/70">
                        If you are not satisfied with our response, you can lodge a complaint 
                        with the ICO at ico.org.uk
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DataRights;