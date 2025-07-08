import React, { useState } from 'react';
import { BookOpen, Users, Shield, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navigation from '@/components/Navigation';
import ContactModal from '@/components/ContactModal';
import Footer from '@/components/Footer';
import LegalRightsModal from '@/components/LegalRightsModal';
import SupportNetworksModal from '@/components/SupportNetworksModal';
import SelfCareModal from '@/components/SelfCareModal';

const Resources = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLegalRightsModalOpen, setIsLegalRightsModalOpen] = useState(false);
  const [isSupportNetworksModalOpen, setIsSupportNetworksModalOpen] = useState(false);
  const [isSelfCareModalOpen, setIsSelfCareModalOpen] = useState(false);

  const businessSupportOrganizations = [
    {
      category: "Inclusive Workplace Training & Policy Guidance",
      organizations: [
        {
          name: "Stonewall",
          description: "UK's leading LGBT+ equality charity",
          support: "Trans inclusion training, workplace resources, Diversity Champions programme",
          website: "stonewall.org.uk"
        },
        {
          name: "Gendered Intelligence",
          description: "Trans-led charity focused on education and inclusivity",
          support: "Bespoke training for organisations, schools, and workplaces",
          website: "genderedintelligence.co.uk"
        },
        {
          name: "TransActual UK",
          description: "Trans-led organisation campaigning for rights and visibility",
          support: "Toolkits for employers, inclusion audits, lived experience speakers",
          website: "transactual.org.uk"
        },
        {
          name: "LGBT Foundation",
          description: "Manchester-based national LGBT+ health and rights charity",
          support: "Trans Programme support, business workshops, community engagement",
          website: "lgbt.foundation"
        },
        {
          name: "Switchboard LGBT+",
          description: "One of the UK's longest-running LGBT+ support lines",
          support: "Diversity training for organisations, particularly in frontline/public-facing roles",
          website: "switchboard.lgbt"
        }
      ]
    },
    {
      category: "Specialist Business & Sector-Specific Support",
      organizations: [
        {
          name: "OutBritain",
          description: "The UK's LGBTQ+ Chamber of Commerce",
          support: "Business resources, supplier diversity, and inclusion guidance",
          website: "outbritain.co.uk"
        },
        {
          name: "Pride in Business",
          description: "UK initiative supporting LGBTQ+ inclusion in SMEs and consumer venues",
          support: "Community events, business ally network, small business toolkits",
          website: "prideinbusiness.org"
        },
        {
          name: "Inclusive Employers",
          description: "UK inclusion consultancy working across all sectors",
          support: "Trans awareness training, policy reviews, e-learning",
          website: "inclusiveemployers.co.uk"
        }
      ]
    },
    {
      category: "Peer Networks & Visibility Platforms",
      organizations: [
        {
          name: "Trans in the City",
          description: "A collaboration of companies advocating for trans inclusion at work",
          support: "Events, panel discussions, corporate guidance",
          website: "transinthecity.co.uk"
        },
        {
          name: "myGwork",
          description: "LGBTQ+ recruitment & employer ratings platform",
          support: "Trans inclusion best practices for HR & recruitment",
          website: "mygwork.com"
        }
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation currentPage="resources" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-trans-blue mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-brand-navy mb-4">Resources & Support</h1>
          <p className="text-xl text-brand-navy/70 max-w-3xl mx-auto">
            Educational materials, support resources, and guidance for creating more inclusive spaces
          </p>
        </div>

        <Tabs defaultValue="individuals" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="individuals">For Individuals</TabsTrigger>
            <TabsTrigger value="businesses">For Businesses</TabsTrigger>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-trans-blue text-trans-blue hover:bg-trans-blue/10"
                    onClick={() => setIsLegalRightsModalOpen(true)}
                  >
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-trans-pink text-trans-pink hover:bg-trans-pink/10"
                    onClick={() => setIsSupportNetworksModalOpen(true)}
                  >
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-trans-blue text-trans-blue hover:bg-trans-blue/10"
                    onClick={() => setIsSelfCareModalOpen(true)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Advice
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
                    <p className="font-medium text-red-800 mb-3">🇬🇧 United Kingdom - 24/7 Crisis Support</p>
                    <div className="space-y-1 text-red-700 text-sm">
                      <p>
                        <a href="https://switchboard.lgbt" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Switchboard LGBT+
                        </a> Helpline: 0300 330 0630
                      </p>
                      <p>MindLine Trans+: 0300 330 5468</p>
                      <p>Samaritans (All UK, including LGBTQ+): 116 123</p>
                      <p>
                        <a href="https://galop.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Galop
                        </a> – National LGBT+ Domestic Abuse: 0800 999 5428
                      </p>
                      <p>Shout (Crisis Text): Text LGBTQ to 85258</p>
                      <p>
                        <a href="https://mermaidsuk.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Mermaids
                        </a> (Trans Youth & Families): 0808 801 0400
                      </p>
                      <p>999 – Emergency Services</p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800 mb-3">🇺🇸 United States - 24/7 Crisis Support</p>
                    <div className="space-y-1 text-red-700">
                      <p>
                        <a href="https://translifeline.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Trans Lifeline
                        </a>: 877-565-8860
                      </p>
                      <p>
                        <a href="https://lgbthotline.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          LGBT National Hotline
                        </a>: 1-888-843-4564
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-trans-blue/10 border border-trans-blue/30 rounded-lg">
                    <p className="font-medium text-trans-blue mb-2">🇬🇧 United Kingdom - Legal Support</p>
                    <div className="text-brand-navy/70 text-sm space-y-1">
                      <p>
                        <a href="https://galop.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Galop
                        </a> – LGBT+ Hate Crime, Domestic Abuse, and Legal Support: 0800 999 5428
                      </p>
                      <p>
                        <a href="https://lgbt.foundation" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          LGBT Foundation
                        </a>: 0345 3 30 30 30
                      </p>
                      <p>
                        <a href="https://stonewall.org.uk/help-and-advice" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Stonewall Information Service
                        </a>
                      </p>
                      <p>
                        <a href="https://transactual.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          TransActual UK
                        </a>
                      </p>
                      <p>
                        <a href="https://lawworks.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          LawWorks Clinics
                        </a>
                      </p>
                      <p>
                        <a href="https://citizensadvice.org.uk" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Citizens Advice
                        </a>: 0800 144 8848
                      </p>
                      <p>ACAS (Employment Discrimination): 0300 123 1100</p>
                    </div>
                  </div>

                  <div className="p-3 bg-trans-blue/10 border border-trans-blue/30 rounded-lg">
                    <p className="font-medium text-trans-blue mb-2">🇺🇸 United States - Legal Support</p>
                    <div className="text-brand-navy/70 text-sm space-y-1">
                      <p>
                        <a href="https://transgenderlegal.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Transgender Legal Defense & Education Fund
                        </a>
                      </p>
                      <p>
                        <a href="https://lambdalegal.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Lambda Legal
                        </a>: 1-866-542-8336
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-navy mb-4">
                  Organisations That Support Trans Inclusion in Businesses & Venues
                </h2>
                <p className="text-brand-navy/70">
                  Connect with leading organisations that provide training, resources, and support for creating trans-inclusive workplaces and customer experiences.
                </p>
              </div>

              {businessSupportOrganizations.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-trans-blue/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-brand-navy">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/4">Organisation</TableHead>
                          <TableHead className="w-1/3">Description</TableHead>
                          <TableHead className="w-1/3">Support Offered</TableHead>
                          <TableHead className="w-1/6">Website</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.organizations.map((org, orgIndex) => (
                          <TableRow key={orgIndex}>
                            <TableCell className="font-medium text-brand-navy">{org.name}</TableCell>
                            <TableCell className="text-brand-navy/70">{org.description}</TableCell>
                            <TableCell className="text-brand-navy/70">{org.support}</TableCell>
                            <TableCell>
                              <a
                                href={`https://${org.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-trans-blue hover:text-trans-blue/80 underline flex items-center space-x-1"
                              >
                                <span className="text-sm">{org.website}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
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
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-trans-white hover:bg-trans-white/90 text-brand-navy"
              onClick={() => setIsContactModalOpen(true)}
            >
              Contact Our Support Team
            </Button>
          </CardContent>
        </Card>

        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)} 
        />

        <LegalRightsModal 
          isOpen={isLegalRightsModalOpen} 
          onClose={() => setIsLegalRightsModalOpen(false)} 
        />

        <SupportNetworksModal 
          isOpen={isSupportNetworksModalOpen} 
          onClose={() => setIsSupportNetworksModalOpen(false)} 
        />

        <SelfCareModal 
          isOpen={isSelfCareModalOpen} 
          onClose={() => setIsSelfCareModalOpen(false)} 
        />
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
