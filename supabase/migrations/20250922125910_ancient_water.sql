/*
  # Travel Platform Database Schema

  1. New Tables
    - `products` - Physical and digital products (rucksacks, itineraries)
    - `trips` - Available trips with dates and capacity
    - `bookings` - Trip bookings with user details
    - `orders` - Product orders and payments
    - `reviews` - User reviews and ratings
    - `community_posts` - Community content
    - `sponsorships` - Brand partnerships
    - `users` - Extended user profiles
    - `inventory` - Product inventory tracking
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Admin-only policies for management tables

  3. Features
    - Payment tracking (M-Pesa and Stripe)
    - Booking management with availability
    - Review system with moderation
    - Community features
    - Sponsorship management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  emergency_contact text,
  emergency_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false
);

-- Products table (rucksacks and digital itineraries)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category text NOT NULL CHECK (category IN ('physical', 'digital')),
  type text NOT NULL CHECK (type IN ('rucksack', 'itinerary', 'gear')),
  images text[] DEFAULT '{}',
  digital_file_url text,
  destination text,
  duration text,
  highlights text[],
  is_active boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  price decimal(10,2) NOT NULL,
  max_capacity integer NOT NULL,
  current_bookings integer DEFAULT 0,
  images text[] DEFAULT '{}',
  highlights text[],
  includes text[],
  excludes text[],
  difficulty_level text CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  booking_reference text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount decimal(10,2) NOT NULL,
  payment_method text CHECK (payment_method IN ('mpesa', 'stripe')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_reference text,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_reference text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL,
  payment_method text CHECK (payment_method IN ('mpesa', 'stripe')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_reference text,
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  images text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  logo_url text,
  description text,
  website_url text,
  partnership_type text CHECK (partnership_type IN ('current', 'past', 'potential')),
  start_date date,
  end_date date,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Trips policies (public read, admin write)
CREATE POLICY "Anyone can read active trips" ON trips
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage trips" ON trips
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Order items policies
CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can read approved reviews" ON reviews
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own reviews" ON reviews
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Community posts policies
CREATE POLICY "Anyone can read community posts" ON community_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts" ON community_posts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Community comments policies
CREATE POLICY "Anyone can read comments" ON community_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments" ON community_comments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Sponsorships policies (public read, admin write)
CREATE POLICY "Anyone can read sponsorships" ON sponsorships
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sponsorships" ON sponsorships
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsorships_updated_at BEFORE UPDATE ON sponsorships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO products (name, description, price, category, type, images, destination, duration, highlights, stock_quantity) VALUES
('Muchina Explorer Rucksack', 'Premium 45L backpack designed for African adventures', 89.99, 'physical', 'rucksack', 
 ARRAY['https://images.pexels.com/photos/346768/pexels-photo-346768.jpeg'], NULL, NULL, NULL, 50),
('Muchina Day Pack', 'Compact 25L daypack for city exploration', 49.99, 'physical', 'rucksack',
 ARRAY['https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg'], NULL, NULL, NULL, 75),
('Cape Town Adventure Guide', 'Complete 7-day itinerary for Cape Town exploration', 29.99, 'digital', 'itinerary',
 ARRAY['https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg'], 'Cape Town, South Africa', '7 days',
 ARRAY['Table Mountain hike', 'Wine tasting tours', 'Penguin colony visit', 'City bowl exploration'], 0),
('Zanzibar Paradise Itinerary', '5-day tropical island adventure guide', 24.99, 'digital', 'itinerary',
 ARRAY['https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg'], 'Zanzibar, Tanzania', '5 days',
 ARRAY['Stone Town tour', 'Spice farm visits', 'Beach relaxation', 'Snorkeling adventures'], 0);

INSERT INTO trips (title, description, destination, start_date, end_date, price, max_capacity, images, highlights, includes, excludes, difficulty_level) VALUES
('Maasai Mara Safari Experience', 'Witness the Great Migration and Big Five in Kenya''s premier game reserve', 'Maasai Mara, Kenya', '2025-03-15', '2025-03-20', 1250.00, 12,
 ARRAY['https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg'], 
 ARRAY['Big Five game drives', 'Great Migration viewing', 'Maasai cultural visit', 'Hot air balloon safari'],
 ARRAY['Accommodation', 'All meals', 'Game drives', 'Park fees', 'Professional guide'],
 ARRAY['International flights', 'Personal expenses', 'Tips', 'Travel insurance'],
 'moderate'),
('Diani Beach Coastal Retreat', 'Relax on pristine white sand beaches with crystal clear waters', 'Diani Beach, Kenya', '2025-04-08', '2025-04-11', 850.00, 16,
 ARRAY['https://images.pexels.com/photos/1288484/pexels-photo-1288484.jpeg'],
 ARRAY['Beach relaxation', 'Water sports', 'Coral reef snorkeling', 'Sunset dhow cruise'],
 ARRAY['Beach resort accommodation', 'Breakfast and dinner', 'Airport transfers', 'Snorkeling gear'],
 ARRAY['Lunch', 'Alcoholic beverages', 'Water sports equipment', 'Personal expenses'],
 'easy'),
('Mount Kenya Climbing Expedition', 'Challenge yourself with Africa''s second highest peak', 'Mount Kenya, Kenya', '2025-05-20', '2025-05-26', 1450.00, 8,
 ARRAY['https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg'],
 ARRAY['Point Lenana summit', 'Alpine scenery', 'Unique flora and fauna', 'Mountain huts experience'],
 ARRAY['Mountain hut accommodation', 'All meals', 'Professional mountain guide', 'Climbing permits'],
 ARRAY['Personal climbing gear', 'Tips for guides', 'Travel insurance', 'Emergency evacuation'],
 'challenging');

INSERT INTO sponsorships (company_name, logo_url, description, website_url, partnership_type, is_featured) VALUES
('Kenya Airways', 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg', 'Official airline partner providing flight connections across Africa', 'https://www.kenya-airways.com', 'current', true),
('Safaricom', 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg', 'Telecommunications partner enabling seamless connectivity during travels', 'https://www.safaricom.co.ke', 'current', true),
('Tusker Beer', 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg', 'Refreshment partner for adventure celebrations', 'https://www.tusker.co.ke', 'past', false);

INSERT INTO reviews (user_id, trip_id, rating, title, comment, is_approved) VALUES
((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM trips WHERE title = 'Maasai Mara Safari Experience'), 5, 'Incredible Safari Experience!', 'Muchina made this trip unforgettable. The wildlife viewing was spectacular and the cultural experience was authentic.', true),
((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM trips WHERE title = 'Diani Beach Coastal Retreat'), 5, 'Perfect Beach Getaway', 'Exactly what I needed - beautiful beaches, great company, and well-organized activities.', true);