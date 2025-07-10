-- Update Privacy Policy content
UPDATE public.content_pages 
SET 
  content = '<div class="mb-8">
    <h1 class="font-bold text-brand-navy text-3xl mb-4">Privacy Policy</h1>
    <p class="text-brand-navy/70">Last updated: ' || to_char(now(), 'DD Month YYYY') || '</p>
  </div>

  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
    <div class="prose prose-lg max-w-none text-brand-navy/80">
      <p class="lead">
        At Rest with Respect, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform to find and share information about transgender-friendly venues.
      </p>
      
      <h2>Information We Collect</h2>
      <h3>Information You Provide to Us</h3>
      <p>We may collect information you provide directly to us, including:</p>
      <ul>
        <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password</li>
        <li><strong>Profile Information:</strong> Any additional information you choose to add to your profile</li>
        <li><strong>Venue Reviews:</strong> Reviews, ratings, and comments you submit about venues</li>
        <li><strong>Venue Submissions:</strong> Information about venues you submit for inclusion in our directory</li>
        <li><strong>Communications:</strong> Messages you send to us through contact forms or support channels</li>
      </ul>
      
      <h3>Information We Collect Automatically</h3>
      <p>When you use our platform, we automatically collect certain information:</p>
      <ul>
        <li><strong>Usage Information:</strong> How you interact with our website and services</li>
        <li><strong>Device Information:</strong> Information about your device, browser, and operating system</li>
        <li><strong>Location Information:</strong> General location data to help you find nearby venues (with your permission)</li>
        <li><strong>Log Information:</strong> Server logs that may include IP addresses, access times, and pages viewed</li>
      </ul>
      
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process and display venue reviews and submissions</li>
        <li>Help you find transgender-friendly venues in your area</li>
        <li>Communicate with you about our services, updates, and support</li>
        <li>Ensure the safety, security, and integrity of our platform</li>
        <li>Comply with legal obligations and protect our rights</li>
        <li>Analyze usage patterns to improve user experience</li>
      </ul>
      
      <h2>Information Sharing and Disclosure</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
      
      <h3>Public Information</h3>
      <ul>
        <li>Venue reviews and ratings you submit are publicly visible (associated with your username, not your real name unless you choose to display it)</li>
        <li>Venue information you submit may be publicly displayed if approved</li>
      </ul>
      
      <h3>Service Providers</h3>
      <p>We may share information with trusted third-party service providers who assist us in:</p>
      <ul>
        <li>Hosting and maintaining our website</li>
        <li>Processing payments (if applicable)</li>
        <li>Analyzing website usage and performance</li>
        <li>Providing customer support</li>
      </ul>
      
      <h3>Legal Requirements</h3>
      <p>We may disclose your information when required by law, including:</p>
      <ul>
        <li>To comply with legal processes or government requests</li>
        <li>To protect our rights, property, or safety</li>
        <li>To protect the rights, property, or safety of our users or others</li>
        <li>To investigate potential violations of our terms of service</li>
      </ul>
      
      <h2>Data Security</h2>
      <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
      <ul>
        <li>Encryption of data in transit and at rest</li>
        <li>Regular security assessments and updates</li>
        <li>Access controls and authentication requirements</li>
        <li>Employee training on data protection practices</li>
      </ul>
      
      <h2>Data Retention</h2>
      <p>We retain your personal information for as long as necessary to:</p>
      <ul>
        <li>Provide our services to you</li>
        <li>Comply with legal obligations</li>
        <li>Resolve disputes and enforce our agreements</li>
        <li>Maintain the integrity of our venue database</li>
      </ul>
      
      <h2>Your Rights and Choices</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul>
        <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
        <li><strong>Deletion:</strong> Request deletion of your personal information (subject to certain limitations)</li>
        <li><strong>Portability:</strong> Request a copy of your data in a structured, commonly used format</li>
        <li><strong>Objection:</strong> Object to certain processing of your personal information</li>
        <li><strong>Withdrawal:</strong> Withdraw consent for processing where we rely on your consent</li>
      </ul>
      
      <p>To exercise these rights, please contact us at privacy@restwithrespect.org.</p>
      
      <h2>Cookies and Tracking Technologies</h2>
      <p>We use cookies and similar technologies to:</p>
      <ul>
        <li>Remember your preferences and settings</li>
        <li>Authenticate your account</li>
        <li>Analyze how our website is used</li>
        <li>Improve our services and user experience</li>
      </ul>
      
      <p>You can control cookies through your browser settings, but this may affect your ability to use certain features of our website.</p>
      
      <h2>Third-Party Links</h2>
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.</p>
      
      <h2>Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of significant changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.</p>
      
      <h2>Contact Us</h2>
      <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
      <ul>
        <li>Email: privacy@restwithrespect.org</li>
        <li>Website: restwithrespect.org/contact</li>
      </ul>
      
      <p class="text-sm text-brand-navy/60 mt-8">
        This Privacy Policy was last updated on ' || to_char(now(), 'DD Month YYYY') || '.
      </p>
    </div>
  </div>',
  updated_at = now()
WHERE slug = 'privacy-policy';

-- Update Terms of Service content
UPDATE public.content_pages 
SET 
  content = '<div class="mb-8">
    <h1 class="font-bold text-brand-navy text-3xl mb-4">Terms of Service</h1>
    <p class="text-brand-navy/70">Last updated: ' || to_char(now(), 'DD Month YYYY') || '</p>
  </div>

  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
    <div class="prose prose-lg max-w-none text-brand-navy/80">
      <p class="lead">
        Welcome to Rest with Respect. These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using Rest with Respect, you agree to be bound by these Terms.
      </p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing, browsing, or using the Rest with Respect website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services.</p>
      
      <h2>2. Description of Service</h2>
      <p>Rest with Respect is a platform that helps users discover and share information about transgender-friendly venues and services. Our services include:</p>
      <ul>
        <li>A searchable directory of transgender-friendly venues</li>
        <li>User reviews and ratings of venues</li>
        <li>Venue submission and verification processes</li>
        <li>Educational resources and community guidelines</li>
        <li>Tools for venue owners to manage their listings</li>
      </ul>
      
      <h2>3. User Accounts and Registration</h2>
      <h3>Account Creation</h3>
      <p>To access certain features, you may need to create an account. When creating an account, you agree to:</p>
      <ul>
        <li>Provide accurate, current, and complete information</li>
        <li>Maintain and update your account information</li>
        <li>Keep your password secure and confidential</li>
        <li>Notify us immediately of any unauthorized use of your account</li>
        <li>Take responsibility for all activities under your account</li>
      </ul>
      
      <h3>Account Eligibility</h3>
      <p>You must be at least 13 years old to create an account. Users under 18 should have parental guidance when using our services.</p>
      
      <h2>4. User Conduct and Content Guidelines</h2>
      <h3>Acceptable Use</h3>
      <p>When using our platform, you agree to:</p>
      <ul>
        <li>Use the service only for lawful purposes</li>
        <li>Respect the rights and dignity of all users</li>
        <li>Provide accurate and truthful information in reviews and submissions</li>
        <li>Follow our community guidelines and code of conduct</li>
        <li>Respect intellectual property rights</li>
      </ul>
      
      <h3>Prohibited Conduct</h3>
      <p>You may not:</p>
      <ul>
        <li>Submit false, misleading, or defamatory content</li>
        <li>Harass, threaten, or discriminate against other users</li>
        <li>Use offensive, inappropriate, or harmful language</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Interfere with the proper functioning of our services</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Impersonate others or misrepresent your identity or affiliation</li>
        <li>Spam or engage in commercial solicitation without permission</li>
      </ul>
      
      <h2>5. Content Ownership and Licensing</h2>
      <h3>Your Content</h3>
      <p>You retain ownership of content you submit to our platform. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to:</p>
      <ul>
        <li>Display, distribute, and promote your content on our platform</li>
        <li>Modify content for formatting and display purposes</li>
        <li>Use content for improving our services and user experience</li>
      </ul>
      
      <h3>Our Content</h3>
      <p>All content, features, and functionality of our platform are owned by Rest with Respect and are protected by copyright, trademark, and other intellectual property laws.</p>
      
      <h2>6. Reviews and Venue Information</h2>
      <h3>Review Standards</h3>
      <p>Reviews must be:</p>
      <ul>
        <li>Based on genuine, first-hand experiences</li>
        <li>Honest, fair, and constructive</li>
        <li>Focused on relevant aspects of the venue experience</li>
        <li>Free from personal attacks or irrelevant information</li>
      </ul>
      
      <h3>Moderation</h3>
      <p>We reserve the right to moderate, edit, or remove content that violates these Terms or our community standards. This includes reviews that are:</p>
      <ul>
        <li>False, misleading, or fraudulent</li>
        <li>Offensive, discriminatory, or harmful</li>
        <li>Spam or commercially motivated</li>
        <li>Off-topic or irrelevant</li>
      </ul>
      
      <h2>7. Venue Owner Responsibilities</h2>
      <p>Venue owners using our platform agree to:</p>
      <ul>
        <li>Provide accurate information about their venues</li>
        <li>Maintain transgender-friendly policies and practices</li>
        <li>Respond professionally to reviews and feedback</li>
        <li>Keep venue information up-to-date</li>
        <li>Honor commitments made regarding inclusive practices</li>
      </ul>
      
      <h2>8. Privacy and Data Protection</h2>
      <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
      
      <h2>9. Disclaimers and Limitations</h2>
      <h3>Service Availability</h3>
      <p>Our services are provided "as is" and "as available." We do not guarantee:</p>
      <ul>
        <li>Uninterrupted or error-free service</li>
        <li>Complete accuracy of venue information</li>
        <li>That our service will meet all your requirements</li>
        <li>The behavior or policies of listed venues</li>
      </ul>
      
      <h3>User-Generated Content</h3>
      <p>We are not responsible for user-generated content, including reviews and venue submissions. Users are solely responsible for their contributions.</p>
      
      <h3>Third-Party Venues</h3>
      <p>We do not control or endorse third-party venues listed on our platform. We are not responsible for their actions, policies, or services.</p>
      
      <h2>10. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Rest with Respect and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>
      
      <h2>11. Indemnification</h2>
      <p>You agree to indemnify and hold harmless Rest with Respect from any claims, damages, or expenses arising from your violation of these Terms or your use of our services.</p>
      
      <h2>12. Termination</h2>
      <p>We may terminate or suspend your account and access to our services at our discretion, with or without notice, for violations of these Terms or other reasonable causes. You may also terminate your account at any time.</p>
      
      <h2>13. Changes to Terms</h2>
      <p>We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting updated Terms on our website. Your continued use of our services after changes constitutes acceptance of the new Terms.</p>
      
      <h2>14. Governing Law and Dispute Resolution</h2>
      <p>These Terms are governed by the laws of [Jurisdiction]. Any disputes will be resolved through binding arbitration in accordance with applicable arbitration rules.</p>
      
      <h2>15. Severability</h2>
      <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>
      
      <h2>16. Contact Information</h2>
      <p>For questions about these Terms, please contact us at:</p>
      <ul>
        <li>Email: legal@restwithrespect.org</li>
        <li>Website: restwithrespect.org/contact</li>
      </ul>
      
      <p class="text-sm text-brand-navy/60 mt-8">
        These Terms of Service were last updated on ' || to_char(now(), 'DD Month YYYY') || '.
      </p>
    </div>
  </div>',
  updated_at = now()
WHERE slug = 'terms-of-service';