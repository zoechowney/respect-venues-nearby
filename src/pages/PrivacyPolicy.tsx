import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DynamicContent from '@/components/DynamicContent';
import { useIsMobile } from '@/hooks/use-mobile';

const PrivacyPolicy = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation />
      
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <DynamicContent
            slug="privacy-policy"
            fallback={
              <div>
                <div className="mb-8">
                  <h1 className={`font-bold text-brand-navy ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4`}>
                    Privacy Policy
                  </h1>
                  <p className="text-brand-navy/70">
                    Last updated: {new Date().toLocaleDateString('en-GB')}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
                  <div className="prose prose-lg max-w-none text-brand-navy/80">
                    <p className="lead">
                      At Rest with Respect, we are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                    
                    <h2>Information We Collect</h2>
                    <p>
                      We may collect information you provide directly to us, such as when you create an account, submit venue information, or contact us. This may include:
                    </p>
                    <ul>
                      <li>Name and contact information</li>
                      <li>Account credentials</li>
                      <li>Venue reviews and ratings</li>
                      <li>Communication preferences</li>
                    </ul>
                    
                    <h2>How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                      <li>Provide and maintain our services</li>
                      <li>Process venue submissions and reviews</li>
                      <li>Communicate with you about our services</li>
                      <li>Improve our platform and user experience</li>
                      <li>Ensure the safety and security of our community</li>
                    </ul>
                    
                    <h2>Information Sharing</h2>
                    <p>
                      We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information:
                    </p>
                    <ul>
                      <li>With venue owners when you submit reviews (review content only)</li>
                      <li>When required by law or to protect our rights</li>
                      <li>With service providers who assist in operating our platform</li>
                    </ul>
                    
                    <h2>Data Security</h2>
                    <p>
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    
                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                      <li>Access, update, or delete your personal information</li>
                      <li>Opt out of certain communications</li>
                      <li>Request a copy of your data</li>
                      <li>Lodge a complaint with a supervisory authority</li>
                    </ul>
                    
                    <h2>Contact Us</h2>
                    <p>
                      If you have any questions about this Privacy Policy, please contact us at privacy@restwithrespect.org.
                    </p>
                    
                    <p className="text-sm text-brand-navy/60 mt-8">
                      Last updated: December 2024
                    </p>
                  </div>
                </div>
              </div>
            }
            renderAsHtml={true}
            className="prose prose-lg max-w-none text-brand-navy/80"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;