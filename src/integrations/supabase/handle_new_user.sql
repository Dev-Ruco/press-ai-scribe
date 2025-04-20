
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
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    (new.raw_user_meta_data->>'birth_date')::date,
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'whatsapp_number',
    (SELECT array_agg(jsonb_array_elements_text(to_jsonb(new.raw_user_meta_data->'specialties')::jsonb)))
  );
  RETURN new;
END;
$$;
