import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Security headers for production
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://api.mapbox.com https://*.supabase.co https://api.tinify.com",
    "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.supabase.co https://api.mapbox.com https://tinypng.com https://api.tinify.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://api.mapbox.com https://api.tinify.com wss://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { ...corsHeaders, ...securityHeaders } 
    })
  }

  try {
    // This is a utility endpoint to get security headers for server configuration
    const url = new URL(req.url)
    
    if (url.pathname === '/security-headers') {
      return new Response(
        JSON.stringify({
          headers: securityHeaders,
          nginx_config: generateNginxConfig(),
          apache_config: generateApacheConfig(),
          cloudflare_config: generateCloudflareConfig()
        }),
        { 
          headers: { 
            ...corsHeaders, 
            ...securityHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Default response for health check
    return new Response(
      JSON.stringify({ status: 'Security headers endpoint active' }),
      { 
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in security-headers function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})

function generateNginxConfig(): string {
  return `
# Nginx security headers configuration
location / {
    add_header Content-Security-Policy "${securityHeaders['Content-Security-Policy']}";
    add_header X-Content-Type-Options "${securityHeaders['X-Content-Type-Options']}";
    add_header X-Frame-Options "${securityHeaders['X-Frame-Options']}";
    add_header X-XSS-Protection "${securityHeaders['X-XSS-Protection']}";
    add_header Referrer-Policy "${securityHeaders['Referrer-Policy']}";
    add_header Permissions-Policy "${securityHeaders['Permissions-Policy']}";
    add_header Strict-Transport-Security "${securityHeaders['Strict-Transport-Security']}";
    add_header Cross-Origin-Embedder-Policy "${securityHeaders['Cross-Origin-Embedder-Policy']}";
    add_header Cross-Origin-Opener-Policy "${securityHeaders['Cross-Origin-Opener-Policy']}";
    add_header Cross-Origin-Resource-Policy "${securityHeaders['Cross-Origin-Resource-Policy']}";
}`.trim()
}

function generateApacheConfig(): string {
  return `
# Apache security headers configuration (.htaccess)
<IfModule mod_headers.c>
    Header always set Content-Security-Policy "${securityHeaders['Content-Security-Policy']}"
    Header always set X-Content-Type-Options "${securityHeaders['X-Content-Type-Options']}"
    Header always set X-Frame-Options "${securityHeaders['X-Frame-Options']}"
    Header always set X-XSS-Protection "${securityHeaders['X-XSS-Protection']}"
    Header always set Referrer-Policy "${securityHeaders['Referrer-Policy']}"
    Header always set Permissions-Policy "${securityHeaders['Permissions-Policy']}"
    Header always set Strict-Transport-Security "${securityHeaders['Strict-Transport-Security']}"
    Header always set Cross-Origin-Embedder-Policy "${securityHeaders['Cross-Origin-Embedder-Policy']}"
    Header always set Cross-Origin-Opener-Policy "${securityHeaders['Cross-Origin-Opener-Policy']}"
    Header always set Cross-Origin-Resource-Policy "${securityHeaders['Cross-Origin-Resource-Policy']}"
</IfModule>`.trim()
}

function generateCloudflareConfig(): string {
  return `
# Cloudflare Workers script example
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  // Add security headers
  ${Object.entries(securityHeaders).map(([key, value]) => 
    `newResponse.headers.set('${key}', '${value}')`
  ).join('\n  ')}
  
  return newResponse
}`.trim()
}