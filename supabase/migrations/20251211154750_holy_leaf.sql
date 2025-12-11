/*
  # Populate Products Table with Travel Items

  1. Digital Travel Itineraries
    - 5 premium travel itineraries for different Kenyan destinations
    - All priced at $3000 with comprehensive highlights
    - Digital downloads with PDF files

  2. Physical Product
    - 1 premium travel backpack
    - Physical product with stock quantity
    - Relevant travel gear highlights
*/

-- Insert 5 Digital Travel Itineraries
INSERT INTO products 
(name, description, price, category, type, images, digital_file_url, destination, duration, highlights, is_active, stock_quantity, created_at, updated_at)
VALUES 
(
  'Ultimate Maasai Mara Safari Experience',
  'Embark on an unforgettable 7-day safari adventure in Kenya''s most famous game reserve. This comprehensive itinerary includes luxury accommodations, expert guides, and exclusive access to the best wildlife viewing spots during the Great Migration season.',
  3000,
  'digital',
  'digital',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/maasai-mara-1.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/maasai-mara-2.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/maasai-mara-3.jpg'
  ],
  'itineraries/Maasai-Mara.pdf',
  'Maasai Mara National Reserve',
  '7 Days / 6 Nights',
  ARRAY[
    'Big Five wildlife encounters',
    'Great Migration viewing (seasonal)',
    'Luxury tented camps',
    'Professional safari guide',
    'Cultural Maasai village visit',
    'Hot air balloon safari option',
    'All meals and transfers included'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Mount Kenya Climbing Expedition',
  'Conquer Africa''s second-highest peak with this expertly crafted 6-day climbing itinerary. Includes detailed route planning, equipment lists, accommodation bookings, and safety protocols for both Sirimon and Chogoria routes.',
  3000,
  'digital',
  'digital',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/mount-kenya-1.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/mount-kenya-2.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/mount-kenya-3.jpg'
  ],
  'itineraries/Mount-Kenya.pdf',
  'Mount Kenya National Park',
  '6 Days / 5 Nights',
  ARRAY[
    'Point Lenana summit attempt',
    'Professional mountain guide',
    'Mountain hut accommodations',
    'Detailed packing checklist',
    'Route maps and GPS coordinates',
    'Emergency evacuation plan',
    'Post-climb celebration dinner'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Diani Beach Coastal Paradise',
  'Discover Kenya''s pristine coastline with this 5-day beach and cultural immersion experience. Perfect blend of relaxation, water sports, and Swahili culture exploration along the Indian Ocean.',
  3000,
  'digital',
  'digital',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/diani-beach-1.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/diani-beach-2.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/diani-beach-3.jpg'
  ],
  'itineraries/Diani-Beach.pdf',
  'Diani Beach, Kwale County',
  '5 Days / 4 Nights',
  ARRAY[
    'Luxury beachfront resort',
    'Dhow sailing excursion',
    'Snorkeling and diving spots',
    'Swahili cooking class',
    'Colobus monkey sanctuary visit',
    'Kite surfing lessons',
    'Sunset camel rides'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Amboseli Elephant Kingdom Safari',
  'Experience the majestic elephants of Amboseli with Mount Kilimanjaro as your backdrop. This 4-day safari focuses on elephant behavior, photography, and conservation education in one of Kenya''s most scenic parks.',
  3000,
  'digital',
  'digital',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/amboseli-1.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/amboseli-2.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/amboseli-3.jpg'
  ],
  'itineraries/Amboseli.pdf',
  'Amboseli National Park',
  '4 Days / 3 Nights',
  ARRAY[
    'Large elephant herds',
    'Mount Kilimanjaro views',
    'Photography workshops',
    'Maasai cultural center',
    'Bird watching (400+ species)',
    'Conservation project visit',
    'Luxury eco-lodge stay'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Lake Nakuru Flamingo Spectacle',
  'Witness millions of flamingos paint Lake Nakuru pink in this 3-day birding and wildlife adventure. Includes rhino tracking, waterfall hikes, and visits to nearby cultural sites in the Great Rift Valley.',
  3000,
  'digital',
  'digital',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/lake-nakuru-1.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/lake-nakuru-2.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/lake-nakuru-3.jpg'
  ],
  'itineraries/Lake-Nakuru.pdf',
  'Lake Nakuru National Park',
  '3 Days / 2 Nights',
  ARRAY[
    'Flamingo viewing spectacle',
    'Black and white rhino tracking',
    'Menengai Crater exploration',
    'Makalia Falls hike',
    'Bird watching (450+ species)',
    'Rift Valley viewpoints',
    'Local community visit'
  ],
  true,
  0,
  NOW(),
  NOW()
);

-- Insert 1 Physical Travel Bag
INSERT INTO products 
(name, description, price, category, type, images, destination, duration, highlights, is_active, stock_quantity, created_at, updated_at)
VALUES 
(
  'Muchina Explorer Pro Backpack',
  'The ultimate travel companion designed by Muchina for the modern African explorer. This premium 45L backpack features weather-resistant materials, ergonomic design, and multiple compartments perfect for safari adventures, mountain climbing, and urban exploration.',
  150,
  'physical',
  'rucksack',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/backpack-1.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/backpack-2.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/backpack-3.jpg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/backpack-4.jpg'
  ],
  NULL,
  NULL,
  ARRAY[
    '45L capacity perfect for 5-7 day trips',
    'Weather-resistant ripstop nylon',
    'Ergonomic padded shoulder straps',
    'Multiple compartments and pockets',
    'Laptop compartment (fits 15" laptop)',
    'Hydration system compatible',
    'Reinforced bottom panel',
    'Lifetime warranty',
    'Designed and tested in Kenya'
  ],
  true,
  25,
  NOW(),
  NOW()
);