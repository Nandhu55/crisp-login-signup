-- Drop the existing unique constraint on username
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_key;

-- Create a partial unique index that allows multiple NULL values but ensures uniqueness for non-NULL values
CREATE UNIQUE INDEX profiles_username_unique_idx ON public.profiles (username) WHERE username IS NOT NULL;

-- Update the handle_new_user function to be more robust with username generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  suggested_username text;
  final_username text;
  counter integer := 1;
BEGIN
  -- Generate a base username from email or use a default
  IF NEW.email IS NOT NULL THEN
    suggested_username := split_part(NEW.email, '@', 1);
  ELSE
    suggested_username := 'user';
  END IF;
  
  -- Clean the username (remove special characters, make lowercase)
  suggested_username := lower(regexp_replace(suggested_username, '[^a-zA-Z0-9]', '', 'g'));
  
  -- Ensure username is not empty
  IF suggested_username = '' OR suggested_username IS NULL THEN
    suggested_username := 'user';
  END IF;
  
  final_username := suggested_username;
  
  -- Check if username exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := suggested_username || counter::text;
    counter := counter + 1;
  END LOOP;

  INSERT INTO public.profiles (user_id, first_name, last_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    final_username
  );
  RETURN NEW;
END;
$$;