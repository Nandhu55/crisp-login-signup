import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string
  type: 'signup' | 'recovery'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, type }: EmailRequest = await req.json()
    
    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: 'Email and type are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate 6-digit OTP code
    const { data: codeData, error: codeError } = await supabase.rpc('generate_otp_code')
    
    if (codeError) {
      console.error('Error generating OTP code:', codeError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP code' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const otpCode = codeData

    // Clean up expired codes first
    await supabase.rpc('cleanup_expired_codes')

    // Store OTP code in database
    const { error: insertError } = await supabase
      .from('email_verification_codes')
      .insert({
        email: email,
        code: otpCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
      })

    if (insertError) {
      console.error('Error storing OTP code:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store OTP code' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send email with OTP code
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: 'B-Tech Hub <onboarding@resend.dev>',
          to: [email],
          subject: 'Your B-Tech Hub Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; text-align: center;">B-Tech Hub</h1>
              <h2 style="color: #333; text-align: center;">Email Verification</h2>
              <p style="color: #666; font-size: 16px;">Your verification code is:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <h1 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });
        
        console.log(`📧 OTP email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue anyway - still return the debug code for demo
      }
    } else {
      console.log('📧 Resend API key not configured - email not sent');
    }
    
    // For demo purposes, we'll log the code
    console.log(`📧 OTP Code for ${email}: ${otpCode}`);
    
    return new Response(
      JSON.stringify({ 
        message: 'OTP sent successfully',
        // Remove this in production! Only for demo
        debug_code: otpCode 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})