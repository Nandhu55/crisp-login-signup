
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; debugCode?: string }>;
  verifyOtp: (email: string, token: string, type: 'signup' | 'recovery') => Promise<{ error: any }>;
  resendOtp: (email: string, type: 'signup' | 'recovery') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('Signing up with email:', email);
    
    // Store user data temporarily and send OTP
    try {
      // Call our custom OTP function
      const response = await fetch('/supabase/functions/v1/send-otp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcHV2aGRld2t6bmFycG5jZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTA0ODksImV4cCI6MjA2ODkyNjQ4OX0.DE0aULuXdPLoqQpF6R7UKRYS4FEjDdOaf4iXbFl65qs`,
        },
        body: JSON.stringify({
          email,
          type: 'signup'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.log('OTP send error:', result.error);
        return { error: { message: result.error } };
      }
      
      // Store signup data temporarily in session storage for later completion
      sessionStorage.setItem('pendingSignup', JSON.stringify({
        email,
        password,
        userData
      }));
      
      console.log('OTP sent successfully:', result);
      return { error: null, debugCode: result.debug_code };
      
    } catch (error) {
      console.log('Signup error:', error);
      return { error: { message: 'Failed to send verification code' } };
    }
  };

  const verifyOtp = async (email: string, token: string, type: 'signup' | 'recovery') => {
    console.log('Verifying OTP:', { email, token, type });
    
    if (type === 'signup') {
      try {
        // Verify OTP code against our database
        const { data: codes, error: fetchError } = await supabase
          .from('email_verification_codes')
          .select('*')
          .eq('email', email)
          .eq('code', token)
          .eq('used', false)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.log('OTP fetch error:', fetchError);
          return { error: { message: 'Failed to verify code' } };
        }

        if (!codes || codes.length === 0) {
          console.log('Invalid or expired OTP code');
          return { error: { message: 'Invalid or expired verification code' } };
        }

        // Mark code as used
        const { error: updateError } = await supabase
          .from('email_verification_codes')
          .update({ used: true })
          .eq('id', codes[0].id);

        if (updateError) {
          console.log('OTP update error:', updateError);
          return { error: { message: 'Failed to verify code' } };
        }

        // Get pending signup data
        const pendingSignupData = sessionStorage.getItem('pendingSignup');
        if (!pendingSignupData) {
          console.log('No pending signup data found');
          return { error: { message: 'Signup session expired. Please start over.' } };
        }

        const { password, userData } = JSON.parse(pendingSignupData);

        // Now create the actual user account
        const { error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData,
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (signupError) {
          console.log('Final signup error:', signupError);
          return { error: signupError };
        }

        // Clear pending signup data
        sessionStorage.removeItem('pendingSignup');
        
        console.log('OTP verification and signup successful');
        return { error: null };

      } catch (error) {
        console.log('OTP verification catch error:', error);
        return { error: { message: 'Failed to verify code' } };
      }
    } else {
      // For recovery, use default Supabase OTP
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type
      });
      return { error };
    }
  };

  const resendOtp = async (email: string, type: 'signup' | 'recovery') => {
    console.log('Resending OTP:', { email, type });
    
    if (type === 'signup') {
      try {
        // Call our custom OTP function
        const response = await fetch('/supabase/functions/v1/send-otp-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcHV2aGRld2t6bmFycG5jZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTA0ODksImV4cCI6MjA2ODkyNjQ4OX0.DE0aULuXdPLoqQpF6R7UKRYS4FEjDdOaf4iXbFl65qs`,
          },
          body: JSON.stringify({
            email,
            type: 'signup'
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          console.log('Resend OTP error:', result.error);
          return { error: { message: result.error } };
        }
        
        console.log('Resend OTP result:', result);
        return { error: null };
        
      } catch (error) {
        console.log('Resend OTP catch error:', error);
        return { error: { message: 'Failed to resend verification code' } };
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      console.log('Reset password result:', { error });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    verifyOtp,
    resendOtp,
    signOut,
    resetPassword,
    signInWithOAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
