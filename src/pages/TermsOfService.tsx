import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const TermsOfService = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation />
      
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`font-bold text-brand-navy ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4`}>
              Terms of Service
            </h1>
            <p className="text-brand-navy/70">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <div className="bg-trans-white/50 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">1. Acceptance of Terms</h2>
              <p className="text-brand-navy/80">
                By accessing and using Rest with Respect ("the Service"), you accept and agree to be 
                bound by the terms and provision of this agreement. If you do not agree to abide by 
                the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">2. Description of Service</h2>
              <p className="text-brand-navy/80 mb-4">
                Rest with Respect is a platform that helps transgender and non-binary people find 
                inclusive venues and spaces across the UK. Our services include:
              </p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                <li>Venue directory and mapping</li>
                <li>User reviews and ratings</li>
                <li>Venue application and verification</li>
                <li>Community resources and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-brand-navy/80">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">4. User Conduct</h2>
              <p className="text-brand-navy/80 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li>Post false, misleading, or discriminatory content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the service</li>
                <li>Post spam, advertisements, or irrelevant content</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">5. Content and Reviews</h2>
              <div className="space-y-4">
                <h3 className="font-medium text-brand-navy">User-Generated Content:</h3>
                <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                  <li>You retain ownership of content you post</li>
                  <li>You grant us a license to use, display, and distribute your content</li>
                  <li>We may moderate, edit, or remove content at our discretion</li>
                  <li>You are responsible for the accuracy of your reviews</li>
                </ul>
                
                <h3 className="font-medium text-brand-navy">Review Guidelines:</h3>
                <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                  <li>Reviews must be based on genuine experiences</li>
                  <li>Be respectful and constructive in your feedback</li>
                  <li>Focus on the inclusivity and accessibility of venues</li>
                  <li>Do not include personal attacks or offensive language</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">6. Venue Listings</h2>
              <p className="text-brand-navy/80 mb-4">
                Venue owners may apply to be listed on our platform. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                <li>Review and approve venue applications</li>
                <li>Verify venue information and inclusivity practices</li>
                <li>Remove listings that do not meet our standards</li>
                <li>Update or modify venue information for accuracy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">7. Privacy and Data Protection</h2>
              <p className="text-brand-navy/80">
                Your privacy is important to us. Please review our Privacy Policy to understand how 
                we collect, use, and protect your personal information. By using our service, you 
                consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">8. Intellectual Property</h2>
              <p className="text-brand-navy/80">
                The Service and its original content, features, and functionality are owned by Rest 
                with Respect and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">9. Disclaimers</h2>
              <div className="space-y-4">
                <p className="text-brand-navy/80">
                  <strong>Service Availability:</strong> We strive to maintain service availability 
                  but cannot guarantee uninterrupted access.
                </p>
                <p className="text-brand-navy/80">
                  <strong>Venue Information:</strong> While we verify venue information, we cannot 
                  guarantee the accuracy of all details or the current inclusivity practices of listed venues.
                </p>
                <p className="text-brand-navy/80">
                  <strong>User Safety:</strong> Users are responsible for their own safety when visiting venues.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">10. Limitation of Liability</h2>
              <p className="text-brand-navy/80">
                Rest with Respect shall not be liable for any indirect, incidental, special, or 
                consequential damages arising from your use of the service. Our liability is limited 
                to the maximum extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">11. Termination</h2>
              <p className="text-brand-navy/80">
                We may terminate or suspend your account immediately, without prior notice, for any 
                reason, including breach of these Terms. Upon termination, your right to use the 
                service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">12. Changes to Terms</h2>
              <p className="text-brand-navy/80">
                We reserve the right to modify these terms at any time. We will notify users of 
                material changes via email or through the service. Continued use after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">13. Governing Law</h2>
              <p className="text-brand-navy/80">
                These Terms shall be governed by and construed in accordance with the laws of 
                England and Wales. Any disputes shall be subject to the exclusive jurisdiction 
                of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">14. Contact Information</h2>
              <div className="bg-brand-navy/5 p-4 rounded-lg">
                <p className="text-brand-navy/80">
                  For questions about these Terms of Service, contact us at:<br />
                  Email: legal@restwithrespect.org<br />
                  Subject: Terms of Service Inquiry
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

export default TermsOfService;