-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  active BOOLEAN DEFAULT false
);

-- Pets Table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  distance TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('公', '母')),
  weight TEXT NOT NULL,
  personality TEXT[] DEFAULT '{}',
  description TEXT,
  health_status TEXT[] DEFAULT '{}',
  -- Flatten shelter to avoid nested JSON queries for simplicity, or use JSONB
  shelter JSONB NOT NULL,
  adoption_fee NUMERIC NOT NULL,
  status TEXT DEFAULT '审核中',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  urgent BOOLEAN DEFAULT false
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  pet_image TEXT,
  unread BOOLEAN DEFAULT false,
  date TEXT
);

-- Insert initial mock data for testing
INSERT INTO categories (name, icon, active) VALUES 
('狗狗', 'PawPrint', true),
('猫猫', 'Cat', false),
('鸟类', 'Leaf', false),
('其他', 'CircleEllipsis', false);

-- Enable RLS (Row Level Security) and set to fully permissive for demonstration
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON categories FOR ALL USING (true);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON pets FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON pets FOR ALL USING (true);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON notifications FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON notifications FOR ALL USING (true);

-- 5. 创建领养申请表 (Adoptions)
CREATE TABLE IF NOT EXISTS public.adoptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    housing_type TEXT NOT NULL,
    has_yard BOOLEAN DEFAULT false,
    ownership_type TEXT NOT NULL,
    current_pets TEXT,
    experience TEXT NOT NULL,
    primary_caregiver TEXT NOT NULL,
    time_commitment TEXT NOT NULL,
    emergency_plan TEXT NOT NULL,
    story TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 开启 RLS
ALTER TABLE public.adoptions ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入领养申请和读取
CREATE POLICY "Enable insert for anonymous users" ON public.adoptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for anonymous users" ON public.adoptions FOR SELECT USING (true);
CREATE POLICY "Enable update for anonymous users" ON public.adoptions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for anonymous users" ON public.adoptions FOR DELETE USING (true);

-- 6. 创建用户表 (Users) 用于管理后台展示
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anonymous users" ON public.users FOR ALL USING (true);
