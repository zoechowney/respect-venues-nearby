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

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-brand-navy/80">
              <p className="lead text-xl mb-6">
                Welcome to Rest with Respect. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or using the Rest with Respect platform ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you must not use our Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you ("User" or "you") and Rest with Respect ("Company," "we," "us," or "our").
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
              <p>
                Rest with Respect is a platform that helps users discover transgender-friendly venues and enables businesses to join our inclusive network. Our services include:
              </p>
              <ul className="mb-4">
                <li>A searchable directory of transgender-friendly venues</li>
                <li>User review and rating system</li>
                <li>Venue submission and approval process</li>
                <li>Educational resources and support information</li>
                <li>Community features for sharing experiences and recommendations</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Account Registration</h3>
              <p>To access certain features, you must create an account by providing:</p>
              <ul className="mb-4">
                <li>Accurate and complete personal information</li>
                <li>A valid email address</li>
                <li>A secure password</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Account Responsibilities</h3>
              <p>You are responsible for:</p>
              <ul className="mb-4">
                <li><strong>Account Security:</strong> Maintaining the confidentiality of your login credentials</li>
                <li><strong>Account Activity:</strong> All activities that occur under your account</li>
                <li><strong>Information Accuracy:</strong> Keeping your account information current and accurate</li>
                <li><strong>Notification:</strong> Immediately notifying us of any unauthorized use of your account</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Account Termination</h3>
              <p>
                You may delete your account at any time through your account settings. We may suspend or terminate your account if you violate these Terms or engage in harmful behavior.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Permitted Uses</h3>
              <p>You may use our Service to:</p>
              <ul className="mb-4">
                <li>Search for and discover transgender-friendly venues</li>
                <li>Submit honest reviews and ratings based on your experiences</li>
                <li>Share information about inclusive businesses</li>
                <li>Access educational resources and support materials</li>
                <li>Engage respectfully with our community</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Prohibited Activities</h3>
              <p>You agree not to:</p>
              <ul className="mb-4">
                <li><strong>Illegal Activities:</strong> Use the Service for any unlawful purpose or to solicit illegal acts</li>
                <li><strong>False Information:</strong> Submit fake reviews, false venue information, or misleading content</li>
                <li><strong>Harassment:</strong> Harass, abuse, threaten, or discriminate against other users</li>
                <li><strong>Intellectual Property Violation:</strong> Infringe on our or others' intellectual property rights</li>
                <li><strong>System Interference:</strong> Attempt to interfere with, damage, or gain unauthorized access to our systems</li>
                <li><strong>Commercial Misuse:</strong> Use the Service for unauthorized commercial purposes or spam</li>
                <li><strong>Impersonation:</strong> Impersonate others or misrepresent your affiliation with any person or entity</li>
                <li><strong>Malicious Content:</strong> Upload viruses, malware, or other harmful code</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Content Guidelines</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">User-Generated Content</h3>
              <p>When submitting reviews, venue information, or other content, it must be:</p>
              <ul className="mb-4">
                <li><strong>Truthful:</strong> Based on genuine experiences and accurate information</li>
                <li><strong>Respectful:</strong> Free from hate speech, discrimination, or offensive language</li>
                <li><strong>Relevant:</strong> Related to the venue or topic being discussed</li>
                <li><strong>Original:</strong> Your own content, not copied from other sources</li>
                <li><strong>Appropriate:</strong> Suitable for a diverse, inclusive community</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Content Moderation</h3>
              <p>
                We reserve the right to review, edit, or remove any content that violates these Terms or our community standards. Content moderation may be performed by automated systems or human reviewers.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Content Ownership and License</h3>
              <p>
                You retain ownership of content you submit but grant us a worldwide, royalty-free license to use, display, and distribute your content in connection with our Service.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Venue Submissions and Reviews</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Venue Submission Process</h3>
              <p>
                Venues submitted to our directory undergo a review process to ensure they meet our standards for transgender-friendly practices. We reserve the right to approve or reject submissions at our discretion.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Review Guidelines</h3>
              <p>Reviews must:</p>
              <ul className="mb-4">
                <li>Be based on actual experiences at the venue</li>
                <li>Focus on accessibility and inclusivity aspects</li>
                <li>Avoid personal attacks or irrelevant complaints</li>
                <li>Respect privacy and confidentiality</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference, explains how we collect, use, and protect your information. By using our Service, you consent to our privacy practices as described in our Privacy Policy.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Our Content</h3>
              <p>
                All content, features, and functionality of our Service, including but not limited to text, graphics, logos, icons, images, software, and design, are owned by Rest with Respect and protected by copyright, trademark, and other intellectual property laws.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use our Service for personal, non-commercial purposes, subject to these Terms.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Restrictions</h3>
              <p>You may not:</p>
              <ul className="mb-4">
                <li>Copy, modify, or create derivative works of our content</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Remove copyright or other proprietary notices</li>
                <li>Use our trademarks without permission</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Service Availability</h3>
              <p>
                We strive to maintain high service availability but cannot guarantee uninterrupted access. The Service is provided "as is" and "as available" without warranties of any kind.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Content</h3>
              <p>
                Our Service may contain links to third-party websites or content. We are not responsible for the accuracy, content, or practices of external sites.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Venue Information</h3>
              <p>
                While we strive for accuracy, we cannot guarantee that all venue information is current or complete. Users should verify information independently before visiting venues.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Rest with Respect shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use of the Service.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Rest with Respect and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service or violation of these Terms.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Modifications to Terms</h2>
              <p>
                We may update these Terms periodically to reflect changes in our Service or legal requirements. We will notify users of significant changes by:
              </p>
              <ul className="mb-4">
                <li>Posting updated Terms on our platform</li>
                <li>Sending email notifications for material changes</li>
                <li>Providing reasonable notice before changes take effect</li>
              </ul>
              <p>
                Continued use of the Service after Terms updates constitutes acceptance of the new Terms.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">13. Termination</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Termination by You</h3>
              <p>
                You may terminate your account at any time by following the account deletion process in your settings or contacting us directly.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Termination by Us</h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice, if you:
              </p>
              <ul className="mb-4">
                <li>Violate these Terms or our community guidelines</li>
                <li>Engage in fraudulent or harmful behavior</li>
                <li>Misuse the Service or interfere with its operation</li>
                <li>Violate applicable laws or regulations</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service ceases immediately. We may retain certain information as required by law or for legitimate business purposes.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">14. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by the laws of the United Kingdom. Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration or in the courts of the United Kingdom.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">15. Contact Information</h2>
              <p>
                If you have questions, concerns, or feedback about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-6">
                <p><strong>Email:</strong> legal@restwithrespect.org</p>
                <p><strong>Subject Line:</strong> Terms of Service Inquiry</p>
                <p><strong>Response Time:</strong> We aim to respond within 7 business days</p>
              </div>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will continue in full force and effect. The unenforceable provision will be replaced with an enforceable provision that most closely reflects the original intent.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">17. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other legal notices published on the Service, constitute the entire agreement between you and Rest with Respect regarding your use of the Service.
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

export default TermsOfService;