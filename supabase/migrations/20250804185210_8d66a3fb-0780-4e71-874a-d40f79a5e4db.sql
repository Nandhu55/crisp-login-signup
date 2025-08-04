-- Fix RLS issue for question_papers table
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Create policy for question_papers to allow all users to read them
CREATE POLICY "Anyone can view question papers" ON public.question_papers
FOR SELECT USING (true);

-- Fix RLS issue for users table  
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own record" ON public.users
FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own record" ON public.users  
FOR UPDATE USING (id = auth.uid());

-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.generate_otp_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  DELETE FROM public.email_verification_codes 
  WHERE expires_at < now() OR used = true;
END;
$function$;