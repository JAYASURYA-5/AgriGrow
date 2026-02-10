-- placeholder migration file
-- Create animals table
CREATE TABLE public.animals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  weight TEXT,
  status TEXT NOT NULL DEFAULT 'healthy',
  location TEXT,
  image TEXT,
  last_checkup TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_records table
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'checkup', 'vaccination', 'treatment', 'note'
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feed_plans table
CREATE TABLE public.feed_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_type TEXT NOT NULL,
  animal_age TEXT,
  animal_weight TEXT,
  recommended_feed TEXT NOT NULL,
  quantity_per_day TEXT NOT NULL,
  cost_per_day DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES public.animals(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'vaccination', 'health', 'feeding', 'environment', 'general'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create environment_readings table
CREATE TABLE public.environment_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market_prices table for caching
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL, -- 'cattle', 'buffalo', 'goat', 'sheep', 'chicken', 'milk', 'egg'
  price DECIMAL(12,2) NOT NULL,
  unit TEXT NOT NULL,
  market_name TEXT,
  state TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  farm_name TEXT,
  phone TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environment_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for animals
CREATE POLICY "Users can view their own animals" ON public.animals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own animals" ON public.animals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own animals" ON public.animals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own animals" ON public.animals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_records
CREATE POLICY "Users can view their own health records" ON public.health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own health records" ON public.health_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health records" ON public.health_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health records" ON public.health_records FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for feed_plans
CREATE POLICY "Users can view their own feed plans" ON public.feed_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own feed plans" ON public.feed_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feed plans" ON public.feed_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own feed plans" ON public.feed_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for environment_readings
CREATE POLICY "Users can view their own environment readings" ON public.environment_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own environment readings" ON public.environment_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for market_prices (public read, authenticated write)
CREATE POLICY "Anyone can view market prices" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert market prices" ON public.market_prices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update market prices" ON public.market_prices FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON public.animals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();