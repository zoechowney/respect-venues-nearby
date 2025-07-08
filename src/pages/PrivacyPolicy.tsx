import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const PrivacyPolicy = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation />
      
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`font-bold text-brand-navy ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4`}>
              Privacy Policy
            </h1>
            <p className="text-brand-navy/70">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <div className="bg-trans-white/50 rounded-lg p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">1. Who We Are</h2>
              <p className="text-brand-navy/80 mb-4">
                Rest with Respect ("we", "our", or "us") operates the website and platform that helps 
                transgender and non-binary people find inclusive venues and spaces across the UK.
              </p>
              <p className="text-brand-navy/80">
                We are committed to protecting your personal data and respecting your privacy rights 
                in accordance with UK GDPR and the Data Protection Act 2018.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">2. What Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Account Information:</h3>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                    <li>Email address</li>
                    <li>Name (if provided)</li>
                    <li>Account preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">User-Generated Content:</h3>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                    <li>Reviews and ratings you submit</li>
                    <li>Venue applications and submissions</li>
                    <li>Messages and communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-brand-navy mb-2">Technical Information:</h3>
                  <ul className="list-disc pl-6 text-brand-navy/80 space-y-1">
                    <li>IP address and location data</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To process venue applications and reviews</li>
                <li>To communicate with you about your account</li>
                <li>To improve our platform and user experience</li>
                <li>To ensure platform safety and prevent abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">4. Legal Basis for Processing</h2>
              <p className="text-brand-navy/80 mb-4">We process your personal data based on:</p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li><strong>Consent:</strong> When you agree to receive communications</li>
                <li><strong>Contract:</strong> To provide our services to you</li>
                <li><strong>Legitimate Interest:</strong> To improve our platform and prevent abuse</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">5. Data Sharing</h2>
              <p className="text-brand-navy/80 mb-4">
                We do not sell your personal data. We may share your information only in these circumstances:
              </p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers who help operate our platform</li>
                <li>In anonymized form for research and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">6. Your Rights</h2>
              <p className="text-brand-navy/80 mb-4">Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 text-brand-navy/80 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate information</li>
                <li><strong>Erasure:</strong> Request deletion of your data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdraw consent:</strong> Remove consent for processing</li>
              </ul>
              <p className="text-brand-navy/80 mt-4">
                To exercise these rights, please contact us using the information below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">7. Data Security</h2>
              <p className="text-brand-navy/80">
                We implement appropriate technical and organizational measures to protect your personal 
                data against unauthorized access, alteration, disclosure, or destruction. However, no 
                internet transmission is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">8. Data Retention</h2>
              <p className="text-brand-navy/80">
                We retain your personal data only as long as necessary for the purposes outlined in 
                this policy or as required by law. Account data is typically retained for 7 years 
                after account closure unless earlier deletion is requested.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">9. International Transfers</h2>
              <p className="text-brand-navy/80">
                Your data may be processed outside the UK. When this occurs, we ensure appropriate 
                safeguards are in place to protect your data in accordance with UK data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">10. Contact Us</h2>
              <p className="text-brand-navy/80 mb-4">
                For any questions about this Privacy Policy or to exercise your rights, contact us at:
              </p>
              <div className="bg-brand-navy/5 p-4 rounded-lg">
                <p className="text-brand-navy/80">
                  Email: privacy@restwithrespect.org<br />
                  Subject: Data Protection Request
                </p>
                <p className="text-brand-navy/80 mt-2">
                  You also have the right to lodge a complaint with the Information Commissioner's 
                  Office (ICO) at ico.org.uk if you believe your data protection rights have been violated.
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

export default PrivacyPolicy;