import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const CookiePolicy = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation />
      
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`font-bold text-brand-navy ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4`}>
              Cookie Policy
            </h1>
            <p className="text-brand-navy/70">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <div className="bg-trans-white/50 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">1. What Are Cookies</h2>
              <p className="text-brand-navy/80">
                Cookies are small text files that are placed on your computer or mobile device when 
                you visit a website. They are widely used to make websites work more efficiently and 
                to provide information to website owners about how users interact with their sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">2. How We Use Cookies</h2>
              <p className="text-brand-navy/80 mb-4">
                Rest with Respect uses cookies to enhance your experience on our platform. We use 
                cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li>Authentication and security</li>
                <li>Remembering your preferences and settings</li>
                <li>Analytics and performance monitoring</li>
                <li>Improving user experience</li>
                <li>Ensuring platform functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Essential Cookies</h3>
                  <p className="text-brand-navy/80 mb-2">
                    These cookies are necessary for the website to function properly. They enable basic 
                    functions like page navigation and access to secure areas.
                  </p>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                    <li>Authentication tokens</li>
                    <li>Session management</li>
                    <li>Security features</li>
                    <li>CSRF protection</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Functional Cookies</h3>
                  <p className="text-brand-navy/80 mb-2">
                    These cookies allow the website to remember choices you make and provide enhanced features.
                  </p>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                    <li>Language preferences</li>
                    <li>Display settings</li>
                    <li>User preferences</li>
                    <li>Location settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Analytics Cookies</h3>
                  <p className="text-brand-navy/80 mb-2">
                    These cookies help us understand how visitors interact with our website by collecting 
                    anonymous information.
                  </p>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                    <li>Page views and traffic sources</li>
                    <li>User behavior patterns</li>
                    <li>Performance metrics</li>
                    <li>Error tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">4. Third-Party Cookies</h2>
              <p className="text-brand-navy/80 mb-4">
                We may use third-party services that place cookies on your device. These services include:
              </p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li><strong>Supabase:</strong> Authentication and database services</li>
                <li><strong>Analytics providers:</strong> For usage statistics and performance monitoring</li>
                <li><strong>Map services:</strong> For location-based features</li>
              </ul>
              <p className="text-brand-navy/80 mt-4">
                These third parties have their own privacy policies and cookie practices. We encourage 
                you to review their policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">5. Cookie Duration</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Session Cookies</h3>
                  <p className="text-brand-navy/80">
                    These are temporary cookies that are deleted when you close your browser.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Persistent Cookies</h3>
                  <p className="text-brand-navy/80">
                    These cookies remain on your device for a set period or until you delete them. 
                    Our persistent cookies typically last:
                  </p>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1 mt-2">
                    <li>Authentication: Up to 30 days</li>
                    <li>Preferences: Up to 1 year</li>
                    <li>Analytics: Up to 2 years</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">6. Managing Cookies</h2>
              <div className="space-y-4">
                <h3 className="font-medium text-brand-navy mb-2">Browser Settings</h3>
                <p className="text-brand-navy/80 mb-4">
                  You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                  <li>View and delete cookies</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block all cookies</li>
                  <li>Clear cookies when you close the browser</li>
                </ul>
                
                <div className="bg-brand-navy/5 p-4 rounded-lg mt-4">
                  <p className="text-brand-navy/80">
                    <strong>Important:</strong> Disabling essential cookies may affect the functionality 
                    of our website and prevent you from using certain features.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">7. Your Choices</h2>
              <p className="text-brand-navy/80 mb-4">You have several options regarding cookies:</p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li><strong>Accept all cookies:</strong> Allow all cookies for the best experience</li>
                <li><strong>Accept essential only:</strong> Only allow necessary cookies</li>
                <li><strong>Customize settings:</strong> Choose which types of cookies to allow</li>
                <li><strong>Reject all:</strong> Block all non-essential cookies (may limit functionality)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">8. Updates to This Policy</h2>
              <p className="text-brand-navy/80">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or applicable laws. We will notify you of any material changes by posting the new policy 
                on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">9. Contact Us</h2>
              <div className="bg-brand-navy/5 p-4 rounded-lg">
                <p className="text-brand-navy/80">
                  If you have any questions about our use of cookies, please contact us at:<br />
                  Email: privacy@restwithrespect.org<br />
                  Subject: Cookie Policy Inquiry
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;