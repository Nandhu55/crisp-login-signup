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
    console.log('🔑 Resend API Key present:', !!resendApiKey);
    
    let emailSent = false;
    let emailError = null;
    
    if (resendApiKey) {
      try {
        console.log('📧 Initializing Resend with API key...');
        const resend = new Resend(resendApiKey);
        
        console.log('📧 Sending OTP email to:', email);
        const emailResult = await resend.emails.send({
          from: 'B-Tech Hub <onboarding@resend.dev>',
          to: [email],
          subject: 'Your B-Tech Hub Verification Code',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>B-Tech Hub - Verification Code</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                <div style="text-align: center; padding: 40px 0;">
                  <h1 style="color: #2563eb; margin: 0; font-size: 28px;">B-Tech Hub</h1>
                  <h2 style="color: #1f2937; margin: 20px 0; font-size: 24px;">Email Verification</h2>
                </div>
                
                <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0; text-align: center;">
                    Use this verification code to complete your signup:
                  </p>
                  <div style="background: #ffffff; padding: 30px; text-align: center; border-radius: 8px; border: 2px solid #e5e7eb;">
                    <span style="color: #1f2937; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${otpCode}</span>
                  </div>
                </div>
                
                <div style="padding: 20px 0; border-top: 1px solid #e5e7eb; margin-top: 30px;">
                  <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">⏰ This code will expire in 10 minutes</p>
                  <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">🔒 If you didn't request this code, please ignore this email</p>
                </div>
                
                <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px;">
                  <p>B-Tech Hub - Your Academic Resource Platform</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        
        console.log('📧 Email send result:', emailResult);
        
        // Check if email actually succeeded
        if (emailResult.error) {
          console.error('❌ Resend API returned error:', emailResult.error);
          emailError = emailResult.error.message || JSON.stringify(emailResult.error);
          emailSent = false;
        } else {
          emailSent = true;
          console.log(`✅ OTP email sent successfully to ${email}`);
        }
      } catch (error) {
        console.error('❌ Failed to send email:', error);
        emailError = error.message || 'Unknown email error';
        emailSent = false;
      }
    } else {
      console.log('⚠️ Resend API key not configured - email not sent');
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'OTP sent successfully',
        email_sent: emailSent,
        email_error: emailError,
        debug_code: !emailSent ? otpCode : undefined  // Return code for testing when email failed
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