-- Create storage bucket for animal images
INSERT INTO storage.buckets (id, name, public) VALUES ('animal-images', 'animal-images', true);

-- Allow authenticated users to upload animal images
CREATE POLICY "Users can upload animal images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'animal-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow public read access to animal images
CREATE POLICY "Animal images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'animal-images');

-- Allow users to update their own animal images
CREATE POLICY "Users can update their own animal images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'animal-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow users to delete their own animal images
CREATE POLICY "Users can delete their own animal images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'animal-images' 
  AND auth.uid() IS NOT NULL
);

-- Create table for daily production records
CREATE TABLE public.daily_production (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  animal_type TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, animal_type, category)
);

-- Enable RLS on daily_production
ALTER TABLE public.daily_production ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_production
CREATE POLICY "Users can view their own production records"
ON public.daily_production
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own production records"
ON public.daily_production
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own production records"
ON public.daily_production
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own production records"
ON public.daily_production
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_daily_production_updated_at
BEFORE UPDATE ON public.daily_production
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();