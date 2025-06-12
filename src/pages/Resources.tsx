
import React from 'react';
import { BookOpen, Users, Shield, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      {/* Navigation */}
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-brand-navy">Rest with Respect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
              <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
              <Link to="/join" className="text-brand-navy hover:text-trans-blue transition-colors">Join Movement</Link>
              <Link to="/resources" className="text-trans-blue font-medium">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-trans-blue mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-brand-navy mb-4">Resources & Support</h1>
          <p className="text-xl text-brand-navy/70 max-w-3xl mx-auto">
            Educational materials, support resources, and guidance for creating more inclusive spaces
          </p>
        </div>

        <Tabs defaultValue="individuals" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="individuals">For Individuals</TabsTrigger>
            <TabsTrigger value="businesses">For Businesses</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="individuals" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-trans-blue/20">
                <CardHeader>
                  <Shield className="w-8 h-8 text-trans-blue mb-2" />
                  <CardTitle className="text-lg text-brand-navy">Know Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-navy/70 mb-4">
                    Understanding your legal rights regarding access to facilities and protection from discrimination.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-trans-blue text-trans-blue hover:bg-trans-blue/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-trans-pink/20">
                <CardHeader>
                  <Users className="w-8 h-8 text-trans-pink mb-2" />
                  <CardTitle className="text-lg text-brand-navy">Support Networks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-navy/70 mb-4">
                    Connect with local and national transgender support organizations and communities.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-trans-pink text-trans-pink hover:bg-trans-pink/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Find Support
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-trans-blue/20">
                <CardHeader>
                  <Heart className="w-8 h-8 text-trans-blue mb-2" />
                  <CardTitle className="text-lg text-brand-navy">Self-Care & Wellbeing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-navy/70 mb-4">
                    Tips and resources for maintaining mental health and wellbeing in challenging situations.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-trans-blue text-trans-blue hover:bg-trans-blue/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-trans-pink/20">
              <CardHeader>
                <CardTitle className="text-brand-navy">Emergency Contacts & Crisis Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800 mb-3">🇺🇸 United States - 24/7 Crisis Support</p>
                    <div className="space-y-1 text-red-700">
                      <p>Trans Lifeline: 877-565-8860</p>
                      <p>LGBT National Hotline: 1-888-843-4564</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800 mb-3">🇬🇧 United Kingdom - 24/7 Crisis Support</p>
                    <div className="space-y-1 text-red-700 text-sm">
                      <p>Switchboard LGBT+ Helpline: 0300 330 0630</p>
                      <p>MindLine Trans+: 0300 330 5468</p>
                      <p>Samaritans (All UK, including LGBTQ+): 116 123</p>
                      <p>Galop – National LGBT+ Domestic Abuse: 0800 999 5428</p>
                      <p>Shout (Crisis Text): Text LGBTQ to 85258</p>
                      <p>Mermaids (Trans Youth & Families): 0808 801 0400</p>
                      <p>999 – Emergency Services</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-trans-blue/10 border border-trans-blue/30 rounded-lg">
                  <p className="font-medium text-trans-blue">Legal Support</p>
                  <p className="text-brand-navy/70">Transgender Legal Defense & Education Fund</p>
                  <p className="text-brand-navy/70">Lambda Legal: 1-866-542-8336</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Inclusivity Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Comprehensive training materials for staff on transgender awareness, inclusive language, and creating welcoming environments.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Understanding transgender experiences</li>
                    <li>• Appropriate language and terminology</li>
                    <li>• Handling sensitive situations</li>
                    <li>• Legal compliance and best practices</li>
                  </ul>
                  <Button size="sm" className="w-full">
                    Access Training Materials
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Policy Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Template policies and procedures for creating transgender-inclusive workplace and customer service policies.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Non-discrimination policies</li>
                    <li>• Facility access guidelines</li>
                    <li>• Customer service standards</li>
                    <li>• Staff behavior expectations</li>
                  </ul>
                  <Button size="sm" className="w-full">
                    Download Templates
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Marketing Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ready-to-use marketing materials to promote your commitment to inclusivity and attract diverse customers.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Social media graphics</li>
                    <li>• Website badges and banners</li>
                    <li>• Print materials and flyers</li>
                    <li>• Press release templates</li>
                  </ul>
                  <Button size="sm" className="w-full">
                    Access Materials
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Implementation Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Step-by-step guide for implementing transgender-inclusive practices in your business operations.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Assessment checklist</li>
                    <li>• Implementation timeline</li>
                    <li>• Staff communication strategies</li>
                    <li>• Measuring success</li>
                  </ul>
                  <Button size="sm" className="w-full">
                    Download Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Community Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Stay informed about upcoming events, workshops, and community gatherings that promote transgender inclusion.
                  </p>
                  <Button size="sm" className="w-full">
                    View Events Calendar
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Volunteer Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Get involved in spreading awareness and supporting the Rest with Respect movement in your community.
                  </p>
                  <Button size="sm" className="w-full">
                    Learn How to Help
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Success Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Read inspiring stories from businesses and individuals who have embraced transgender inclusivity.
                  </p>
                  <Button size="sm" className="w-full">
                    Read Stories
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Research & Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access research, statistics, and reports on transgender inclusion and its positive impact on businesses.
                  </p>
                  <Button size="sm" className="w-full">
                    View Research
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-trans-blue to-trans-pink text-brand-navy border-0">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-brand-navy/80 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our team is here to help answer questions and provide additional support.
            </p>
            <Button variant="secondary" size="lg" className="bg-trans-white hover:bg-trans-white/90 text-brand-navy">
              Contact Our Support Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
