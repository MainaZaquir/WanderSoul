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
  'Zanzibar 2-7 Day Trip',
  'Explore the spice islands, beaches, and Stone Town in Zanzibar.',
  3000,
  'digital',
  'digital',
  ARRAY[
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image10.jpeg',
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image33.jpeg'
  ],
  'itineraries/ZANZIBAR.pdf',
  'Zanzibar',
  '2-7 Days / 1-6 Nights',
  ARRAY[
   'Spice market tour',
   'Salaam Cave',
   'Coral reef snorkeling',
   'Stone Town Guided Tour',
   'Sunset Dhow Cruise',
   'Nakupenda Island'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Cape Town 2-7 Day Trip',
  'Experience safaris, vineyards, and scenic landscapes in South Africa.',
  3000,
  'digital',
  'digital',
  ARRAY[
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image21.jpeg',
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image5.jpeg'
  ],
  'itineraries/CAPETOWN.pdf',
  'CapeTown, South Africa',
  '2-7 Days / 1-6 Nights',
  ARRAY[
   'Penguins at Boulders Beach',
   'Wine tasting',
   'Table Mountain hike',
   'Explore the Bo-Kaap Neighborhood',
   'Robben Island Tour'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Lamu 2-7 Day Trip',
  'Discover the charm, culture, and serene beauty of Lamu.',
  3000,
  'digital',
  'digital',
  ARRAY[
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image15.jpeg'
  ],
  'itineraries/LAMU.pdf',
  'Lamu Island, Kwale County',
  '2-7 Days / 1-6 Nights',
  ARRAY[
   'Lamu Museum',
   'Lamu Town Guided Tour',
   'Sunset Dhow Cruise',
   'Takwa Ruins'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Arusha 2 Day Trip',
  'Explore the stunning landscapes and cultural experiences of Arusha.',
  3000,
  'digital',
  'digital',
  ARRAY[
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image26.jpeg',
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image27.jpeg'
  ],
  'itineraries/ARUSHA.pdf',
  'Amboseli National Park',
  '2 Days / 1 Nights',
  ARRAY[
   'African art gallery',
   'Ngaresero mountain lodge',
   'Meru eco camp',
   'Meserani snake park'
  ],
  true,
  0,
  NOW(),
  NOW()
),
(
  'Dar-es-Salaam 5-7 Day Trip',
  'Enjoy Dar-es-Salaam’s beaches, culture, museums, and coastal adventures.',

  3000,
  'digital',
  'digital',
  ARRAY[
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image26.jpeg',
   'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image27.jpeg'
  ],
  'itineraries/DARESSALAAM.pdf',
  'Dar-es-Salaam, Tanzania',
  '5-7 Days / 4-6 Nights',
  ARRAY[
   'National Museum of Tanzania',
   'National Village Museum',
   'Horse riding and training',
   'Fun City Kigamboni',
   'Bagamoyo'
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
  'Wander Backpack',
  'The ultimate travel companion designed by Muchina for the modern African explorer. This premium 45L backpack features         weather-resistant materials, ergonomic design, and multiple compartments perfect for safari adventures, mountain climbing, and urban exploration.',
  150,
  'physical',
  'rucksack',
  ARRAY[
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/Wander.jpeg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image2.jpeg',
    'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image16.jpeg'
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