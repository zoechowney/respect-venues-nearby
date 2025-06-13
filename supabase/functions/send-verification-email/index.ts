
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    console.log('Edge function called - processing auth hook');
    
    // For Supabase Auth Hooks, check for proper authorization
    const authHeader = req.headers.get('authorization');
    const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET');
    
    console.log('Authorization header present:', !!authHeader);
    console.log('Hook secret configured:', !!hookSecret);
    
    // Supabase Auth Hooks send JWT token in authorization header
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response('Unauthorized - missing authorization header', { 
        status: 401,
        headers: corsHeaders 
      });
    }

    // Get the raw payload first
    const payload = await req.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    // Validate basic payload structure
    if (!payload.user || !payload.email_data) {
      console.error('Invalid payload structure - missing user or email_data');
      return new Response('Invalid payload structure', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Extract user and email data from the webhook payload
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type }
    } = payload;

    console.log('Processing email for user:', user.email);
    console.log('Email action type:', email_action_type);

    if (!user.email) {
      console.error('No email address in user object');
      return new Response('No email address provided', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const verificationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    console.log('Verification URL:', verificationUrl);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your Rest with Respect account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f8fbff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header with logo and branding -->
            <div style="text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #87ceeb 0%, #ffffff 50%, #ffb6c1 100%); padding: 30px; border-radius: 12px;">
              <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="width: 48px; height: 48px; background: #2c5282; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold; font-size: 20px;">R</span>
                </div>
                <h1 style="margin: 0; color: #2c5282; font-size: 28px; font-weight: bold;">Rest with Respect</h1>
              </div>
              <p style="margin: 0; color: #2c5282; font-size: 16px; opacity: 0.8;">Creating inclusive spaces for everyone</p>
            </div>

            <!-- Main content -->
            <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              <h2 style="color: #2c5282; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center;">
                Welcome to Rest with Respect!
              </h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Thank you for joining our community dedicated to creating inclusive and welcoming spaces for transgender and non-binary individuals.
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                To complete your account setup and start exploring friendly venues near you, please verify your email address by clicking the button below:
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #87ceeb, #4299e1); color: #2c5282; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  Verify Your Account
                </a>
              </div>

              <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                If the button doesn't work, you can copy and paste this link into your browser:
                <br>
                <a href="${verificationUrl}" style="color: #4299e1; word-break: break-all;">${verificationUrl}</a>
              </p>

              <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 16px;">
                This verification link will expire in 24 hours. If you didn't create an account with Rest with Respect, you can safely ignore this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding: 20px; color: #718096; font-size: 14px;">
              <p style="margin-bottom: 8px;">
                <strong style="color: #2c5282;">Rest with Respect</strong>
              </p>
              <p style="margin: 0;">
                Helping transgender and non-binary people feel welcome and accepted
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Attempting to send email via Resend...');

    const { error } = await resend.emails.send({
      from: 'Rest with Respect <noreply@resend.dev>',
      to: [user.email],
      subject: 'Welcome to Rest with Respect - Verify Your Account',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Verification email sent successfully to:', user.email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-verification-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification email'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
