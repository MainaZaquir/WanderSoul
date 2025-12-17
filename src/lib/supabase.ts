/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'physical' | 'digital';
  type: 'rucksack' | 'itinerary' | 'gear';
  images: string[];
  digital_file_url?: string;
  destination?: string;
  duration?: string;
  highlights?: string[];
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  price: number;
  max_capacity: number;
  current_bookings: number;
  images: string[];
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  difficulty_level?: 'easy' | 'moderate' | 'challenging';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  user: any;
  id: string;
  trip_id: string;
  user_id: string;
  booking_reference: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  payment_method?: 'mpesa' | 'stripe';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_reference?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  trip?: Trip;
}

export interface Order {
  id: string;
  user_id: string;
  order_reference: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method?: 'mpesa' | 'stripe';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_reference?: string;
  shipping_address?: any;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  trip_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  trip?: Trip;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Sponsorship {
  id: string;
  company_name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  partnership_type: 'current' | 'past' | 'potential';
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}