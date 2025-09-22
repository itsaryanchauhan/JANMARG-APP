-- Supabase Database Schema for Community Reports App
-- Run this in your Supabase SQL Editor

-- Note: ALTER DATABASE commands require superuser privileges and cannot be run in Supabase hosted environment
-- The app.jwt_secret is managed by Supabase automatically

-- Create custom types
CREATE TYPE report_status AS ENUM ('submitted', 'acknowledged', 'assigned', 'in-progress', 'resolved');
CREATE TYPE report_type AS ENUM ('pothole', 'broken-streetlight', 'garbage', 'overgrown-weed', 'water-issue', 'infrastructure', 'traffic', 'animal-issue', 'encroachment', 'garbage-issue');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type report_type NOT NULL,
  image_url TEXT,
  location JSONB, -- Store location as JSON with latitude, longitude, address, area
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_personal BOOLEAN DEFAULT TRUE, -- TRUE for personal reports, FALSE for community reports
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status report_status DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create report_timeline table
CREATE TABLE report_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  status report_status NOT NULL,
  description TEXT NOT NULL,
  assigned_to TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create report_upvotes table
CREATE TABLE report_upvotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(report_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_is_personal ON reports(is_personal);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_location_area ON reports ((location->>'area')); -- Use btree index for text field
CREATE INDEX idx_report_timeline_report_id ON report_timeline(report_id);
CREATE INDEX idx_report_upvotes_report_id ON report_upvotes(report_id);
CREATE INDEX idx_report_upvotes_user_id ON report_upvotes(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_upvotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Reports policies
CREATE POLICY "Users can view all reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can update their own reports" ON reports FOR UPDATE USING (auth.uid() = reporter_id);

-- Report timeline policies
CREATE POLICY "Users can view timeline for all reports" ON report_timeline FOR SELECT USING (true);
CREATE POLICY "Users can insert timeline entries for their reports" ON report_timeline FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM reports WHERE id = report_id AND reporter_id = auth.uid())
);

-- Report upvotes policies
CREATE POLICY "Users can view all upvotes" ON report_upvotes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own upvotes" ON report_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own upvotes" ON report_upvotes FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true);

-- Storage policies for report images
CREATE POLICY "Users can upload report images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Anyone can view report images" ON storage.objects FOR SELECT USING (bucket_id = 'report-images');

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_reports
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();