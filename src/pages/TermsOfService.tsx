import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DynamicContent from '@/components/DynamicContent';
import { useIsMobile } from '@/hooks/use-mobile';

const TermsOfService = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation />
      
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <DynamicContent
            slug="terms-of-service"
            fallback={
              <div>
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
                    <p className="lead">
                      Welcome to Rest with Respect. By using our platform, you agree to these terms and conditions.
                    </p>
                    
                    <h2>Acceptance of Terms</h2>
                    <p>
                      By accessing and using Rest with Respect, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                    
                    <h2>Use License</h2>
                    <p>
                      Permission is granted to temporarily use Rest with Respect for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul>
                      <li>modify or copy the materials</li>
                      <li>use the materials for any commercial purpose or for any public display</li>
                      <li>attempt to reverse engineer any software contained on the platform</li>
                      <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                    
                    <h2>User Accounts</h2>
                    <p>
                      When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                    </p>
                    
                    <h2>Content Guidelines</h2>
                    <p>
                      Users may submit reviews and venue information. All content must be:
                    </p>
                    <ul>
                      <li>Accurate and truthful</li>
                      <li>Respectful and non-discriminatory</li>
                      <li>Free from offensive or inappropriate language</li>
                      <li>Based on actual experiences</li>
                    </ul>
                    
                    <h2>Prohibited Uses</h2>
                    <p>You may not use our service:</p>
                    <ul>
                      <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                      <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                      <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                      <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                      <li>To submit false or misleading information</li>
                    </ul>
                    
                    <h2>Termination</h2>
                    <p>
                      We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
                    </p>
                    
                    <h2>Disclaimer</h2>
                    <p>
                      The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, Rest with Respect excludes all representations, warranties, conditions and terms.
                    </p>
                    
                    <h2>Contact Information</h2>
                    <p>
                      If you have any questions about these Terms of Service, please contact us at legal@restwithrespect.org.
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

export default TermsOfService;