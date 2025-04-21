
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    birth_date,
    country,
    whatsapp_number,
    specialties
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    NULLIF(new.raw_user_meta_data->>'birth_date', '')::date,
    COALESCE(new.raw_user_meta_data->>'country', ''),
    COALESCE(new.raw_user_meta_data->>'whatsapp_number', ''),
    CASE 
      WHEN new.raw_user_meta_data->>'specialties' IS NULL THEN NULL
      ELSE string_to_array(trim(both '[]"' from COALESCE(new.raw_user_meta_data->>'specialties', '')), ',')
    END
  );
  RETURN new;
END;
$$;
