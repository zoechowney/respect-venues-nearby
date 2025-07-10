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

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-brand-navy/80">
              <p className="lead text-xl mb-6">
                At Rest with Respect, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide</h3>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="mb-4">
                <li><strong>Account Information:</strong> Name, email address, and account credentials when you register</li>
                <li><strong>Profile Information:</strong> Any additional details you choose to add to your profile</li>
                <li><strong>Venue Information:</strong> Details about venues you submit for inclusion in our directory</li>
                <li><strong>Reviews and Ratings:</strong> Content you submit when reviewing venues</li>
                <li><strong>Communications:</strong> Messages you send to us or other users through our platform</li>
                <li><strong>Support Requests:</strong> Information provided when contacting customer support</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
              <p>When you use our platform, we automatically collect:</p>
              <ul className="mb-4">
                <li><strong>Usage Data:</strong> How you interact with our platform, pages visited, and features used</li>
                <li><strong>Device Information:</strong> Type of device, operating system, browser type, and IP address</li>
                <li><strong>Location Data:</strong> General location information to help you find nearby venues (only with your permission)</li>
                <li><strong>Cookies and Similar Technologies:</strong> Small data files stored on your device to enhance your experience</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="mb-6">
                <li><strong>Provide Services:</strong> Deliver and maintain our platform functionality</li>
                <li><strong>User Accounts:</strong> Create and manage your account and preferences</li>
                <li><strong>Venue Directory:</strong> Process venue submissions and maintain our directory</li>
                <li><strong>Review System:</strong> Enable the review and rating system while maintaining quality</li>
                <li><strong>Communication:</strong> Send important updates, respond to inquiries, and provide customer support</li>
                <li><strong>Platform Improvement:</strong> Analyze usage patterns to enhance user experience and develop new features</li>
                <li><strong>Safety and Security:</strong> Detect and prevent fraudulent activity, spam, and misuse</li>
                <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights and those of our users</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">We Do Not Sell Your Data</h3>
              <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">When We May Share Information</h3>
              <p>We may share your information in the following limited circumstances:</p>
              <ul className="mb-4">
                <li><strong>Public Reviews:</strong> Reviews and ratings you submit are publicly visible (excluding personal contact information)</li>
                <li><strong>Venue Owners:</strong> Venue owners can see reviews of their venues but not your personal contact information</li>
                <li><strong>Service Providers:</strong> Trusted third-party services that help us operate our platform (hosting, analytics, customer support)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect safety and security</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (with continued privacy protection)</li>
                <li><strong>Consent:</strong> Any other sharing with your explicit consent</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
              <p>
                We implement robust security measures to protect your personal information:
              </p>
              <ul className="mb-4">
                <li><strong>Encryption:</strong> Data is encrypted in transit and at rest using industry-standard protocols</li>
                <li><strong>Access Controls:</strong> Strict access controls limit who can view your information</li>
                <li><strong>Regular Audits:</strong> We regularly review and update our security practices</li>
                <li><strong>Secure Infrastructure:</strong> Our platform uses secure, monitored hosting environments</li>
                <li><strong>Employee Training:</strong> Our team is trained on privacy and security best practices</li>
              </ul>
              <p>
                While we take security seriously, no system is completely secure. We encourage you to use strong passwords and keep your account credentials confidential.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Your Privacy Rights</h2>
              <p>You have important rights regarding your personal information:</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Access and Control</h3>
              <ul className="mb-4">
                <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information in your profile</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Communication Preferences</h3>
              <ul className="mb-4">
                <li><strong>Email Communications:</strong> Opt out of marketing emails while maintaining essential service communications</li>
                <li><strong>Notification Settings:</strong> Control what notifications you receive through your account settings</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Account Management</h3>
              <ul className="mb-4">
                <li><strong>Account Deactivation:</strong> Deactivate your account at any time</li>
                <li><strong>Data Download:</strong> Download your data before account deletion</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="mb-4">
                <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how our platform is used</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant content and measure campaign effectiveness</li>
              </ul>
              <p>
                You can control cookie settings through your browser, though disabling certain cookies may affect platform functionality.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">International Users</h2>
              <p>
                Rest with Respect operates globally. If you're using our platform from outside the UK, your information may be transferred to and processed in countries with different privacy laws. We ensure appropriate safeguards are in place for international transfers.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Children's Privacy</h2>
              <p>
                Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by:
              </p>
              <ul className="mb-4">
                <li>Posting the updated policy on our platform</li>
                <li>Sending email notifications for material changes</li>
                <li>Updating the "Last updated" date at the top of this policy</li>
              </ul>
              <p>
                Continued use of our platform after policy changes constitutes acceptance of the updated terms.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-6">
                <p><strong>Email:</strong> privacy@restwithrespect.org</p>
                <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
              </div>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Regulatory Information</h2>
              <p>
                This Privacy Policy is designed to comply with applicable privacy laws, including the UK GDPR and Data Protection Act 2018. If you believe we have not complied with applicable privacy laws, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) in the UK.
              </p>
              
              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-brand-navy/60">
                  <strong>Last updated:</strong> July 10, 2025<br />
                  <strong>Version:</strong> 2.0<br />
                  <strong>Effective Date:</strong> July 10, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;