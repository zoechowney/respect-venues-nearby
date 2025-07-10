import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateCSP, generateSecurityHeaders } from '@/lib/security';

interface SecurityHeadersProps {
  isDevelopment?: boolean;
}

const SecurityHeaders: React.FC<SecurityHeadersProps> = ({ 
  isDevelopment = process.env.NODE_ENV === 'development' 
}) => {
  const csp = generateCSP(isDevelopment);
  const securityHeaders = generateSecurityHeaders();

  return (
    <Helmet>
      {/* Content Security Policy */}
      <meta httpEquiv="Content-Security-Policy" content={csp} />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content={securityHeaders['X-Content-Type-Options']} />
      <meta httpEquiv="X-Frame-Options" content={securityHeaders['X-Frame-Options']} />
      <meta httpEquiv="X-XSS-Protection" content={securityHeaders['X-XSS-Protection']} />
      <meta httpEquiv="Referrer-Policy" content={securityHeaders['Referrer-Policy']} />
      
      {/* Permissions Policy */}
      <meta httpEquiv="Permissions-Policy" content={securityHeaders['Permissions-Policy']} />
      
      {/* HTTPS Enforcement (only in production) */}
      {!isDevelopment && (
        <meta httpEquiv="Strict-Transport-Security" content={securityHeaders['Strict-Transport-Security']} />
      )}
      
      {/* Cross-Origin Policies */}
      <meta httpEquiv="Cross-Origin-Embedder-Policy" content={securityHeaders['Cross-Origin-Embedder-Policy']} />
      <meta httpEquiv="Cross-Origin-Opener-Policy" content={securityHeaders['Cross-Origin-Opener-Policy']} />
      <meta httpEquiv="Cross-Origin-Resource-Policy" content={securityHeaders['Cross-Origin-Resource-Policy']} />
    </Helmet>
  );
};

export default SecurityHeaders;