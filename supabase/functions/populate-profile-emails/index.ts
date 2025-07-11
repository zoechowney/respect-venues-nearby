import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting to populate profile emails...');

    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw authError;
    }

    console.log(`Found ${authUsers.users.length} auth users`);

    // Get all profiles that don't have emails
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .is('email', null);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    console.log(`Found ${profiles.length} profiles without emails`);

    // Update profiles with their corresponding emails
    let updated = 0;
    for (const profile of profiles) {
      const authUser = authUsers.users.find(user => user.id === profile.id);
      if (authUser?.email) {
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ email: authUser.email })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError);
        } else {
          updated++;
          console.log(`Updated profile ${profile.id} with email ${authUser.email}`);
        }
      }
    }

    console.log(`Successfully updated ${updated} profiles with emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${updated} profiles with emails`,
        total_auth_users: authUsers.users.length,
        profiles_without_emails: profiles.length,
        profiles_updated: updated
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in populate-profile-emails function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});