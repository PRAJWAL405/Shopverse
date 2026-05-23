-- V4: Seed Sample Users, Sellers, Buyers, Products, Images, and Reviews
-- liquibase formatted sql
-- changeset marketplace:4

-- =============================================================
-- SELLER ACCOUNTS  (password for ALL demo accounts = Admin@123)
-- Using the same verified BCrypt hash from V3__seed_admin.sql
-- =============================================================
INSERT INTO users (name, email, password_hash, role, enabled, email_verified) VALUES
('TechZone Store',   'seller.tech@shopverse.com',    '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE),
('Fashion Hub',      'seller.fashion@shopverse.com', '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE),
('Home Essentials',  'seller.home@shopverse.com',    '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE),
('Book World',       'seller.books@shopverse.com',   '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE),
('Sports Arena',     'seller.sports@shopverse.com',  '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE);

-- =============================================================
-- BUYER ACCOUNTS  (password for ALL demo accounts = Admin@123)
-- Using the same verified BCrypt hash from V3__seed_admin.sql
-- =============================================================
INSERT INTO users (name, email, password_hash, role, enabled, email_verified) VALUES
('Alice Johnson',  'alice@shopverse.com',  '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'BUYER', TRUE, TRUE),
('Bob Williams',   'bob@shopverse.com',    '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'BUYER', TRUE, TRUE),
('Carol Martinez', 'carol@shopverse.com',  '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'BUYER', TRUE, TRUE);

-- =============================================================
-- SELLER PROFILES
-- =============================================================
INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'TechZone Store', 'Your one-stop shop for the latest gadgets, smartphones, laptops and accessories.',
  'https://placehold.co/200x200/6366f1/ffffff?text=TZ', TRUE
FROM users WHERE email = 'seller.tech@shopverse.com';

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'Fashion Hub', 'Trendy clothing and accessories for men and women at unbeatable prices.',
  'https://placehold.co/200x200/ec4899/ffffff?text=FH', TRUE
FROM users WHERE email = 'seller.fashion@shopverse.com';

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'Home Essentials', 'Quality home & kitchen products to make your living space beautiful.',
  'https://placehold.co/200x200/f59e0b/ffffff?text=HE', TRUE
FROM users WHERE email = 'seller.home@shopverse.com';

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'Book World', 'A curated collection of books across all genres — fiction, science, self-help and more.',
  'https://placehold.co/200x200/10b981/ffffff?text=BW', TRUE
FROM users WHERE email = 'seller.books@shopverse.com';

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'Sports Arena', 'Professional sports equipment and outdoor gear for every athlete.',
  'https://placehold.co/200x200/ef4444/ffffff?text=SA', TRUE
FROM users WHERE email = 'seller.sports@shopverse.com';

-- =============================================================
-- PRODUCTS — Electronics > Mobile Phones
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'mobile-phones'),
  'Samsung Galaxy S24 Ultra',
  'The ultimate Android flagship. 200MP camera, Snapdragon 8 Gen 3, 5000mAh battery, built-in S Pen. 12GB RAM / 256GB storage.',
  1199.99, 45, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'mobile-phones'),
  'Apple iPhone 15 Pro',
  'Titanium design. A17 Pro chip. 48MP main camera. Action Button. USB-C with USB 3 speeds. Available in Natural Titanium.',
  999.99, 60, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'mobile-phones'),
  'OnePlus 12',
  'Snapdragon 8 Gen 3, Hasselblad camera system, 100W SUPERVOOC fast charging, 5400mAh battery. Performance redefined.',
  699.99, 30, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Electronics > Laptops & Computers
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'laptops-computers'),
  'Apple MacBook Air M3',
  '13.6-inch Liquid Retina display, Apple M3 chip, 8GB RAM, 256GB SSD, 18-hour battery life. Fanless, ultra-thin design.',
  1099.00, 25, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'laptops-computers'),
  'Dell XPS 15 OLED',
  '15.6-inch 3.5K OLED touch display, Intel Core i7-13700H, 16GB DDR5 RAM, 512GB SSD, NVIDIA RTX 4060 GPU.',
  1499.99, 18, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Electronics > Audio
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Sony WH-1000XM5 Headphones',
  'Industry-leading noise cancellation. 30-hour battery. Multipoint connection. Crystal clear hands-free calling. Foldable design.',
  349.99, 80, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Apple AirPods Pro (2nd Gen)',
  'Active Noise Cancellation, Transparency mode, Adaptive Audio. H2 chip. Up to 30 hours total listening time with case.',
  249.99, 100, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Clothing > Men
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-men'),
  'Classic Oxford Cotton Shirt',
  'Premium 100% cotton Oxford weave shirt. Slim fit, button-down collar. Machine washable. Available in White, Blue, and Navy.',
  49.99, 200, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-men'),
  'Slim Fit Chino Pants',
  'Versatile chino pants in a modern slim fit. 98% Cotton, 2% Elastane for comfort. Multiple colors available. Sizes 28–40.',
  59.99, 150, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Clothing > Women
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-women'),
  'Floral Maxi Dress',
  'Elegant floral print maxi dress with adjustable straps and tiered skirt. 100% viscose, breathable and lightweight. Perfect for summer.',
  79.99, 120, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-women'),
  'Cashmere Blend Turtleneck Sweater',
  '70% merino wool, 30% cashmere blend. Ribbed cuffs and hem. Relaxed fit with a cozy turtleneck. Hand wash recommended.',
  129.99, 75, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Home & Kitchen
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.home@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'home-kitchen'),
  'Instant Pot Duo 7-in-1',
  '7-in-1 electric pressure cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 6 Quart.',
  89.99, 55, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.home@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'home-kitchen'),
  'KitchenAid Stand Mixer',
  '5.5 Quart bowl-lift stand mixer. 11 speeds. Includes flat beater, dough hook, and wire whip. Tilt-head design for easy access.',
  449.99, 20, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.home@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'home-kitchen'),
  'Bamboo Cutting Board Set (3-Piece)',
  'Eco-friendly bamboo cutting boards in 3 sizes. Juice grooves prevent spills. Dishwasher safe. Non-slip rubber feet.',
  34.99, 200, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Books
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.books@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'books'),
  'Atomic Habits by James Clear',
  'An easy and proven way to build good habits and break bad ones. #1 New York Times Bestseller. Paperback, 320 pages.',
  16.99, 500, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.books@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'books'),
  'The Pragmatic Programmer',
  'Your journey to mastery — 20th Anniversary Edition. A classic guide for software developers. Hardcover, 352 pages.',
  49.99, 150, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.books@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'books'),
  'Dune by Frank Herbert',
  'The greatest science fiction novel of all time. Set on the desert planet Arrakis. Paperback, 896 pages. A must-read.',
  14.99, 300, 'ACTIVE';

-- =============================================================
-- PRODUCTS — Sports & Outdoors
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.sports@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'sports-outdoors'),
  'Yoga Mat Pro (6mm)',
  'Non-slip natural rubber yoga mat with alignment lines. 6mm thick for joint support. Includes carry strap. 183cm x 61cm.',
  44.99, 180, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.sports@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'sports-outdoors'),
  'Adjustable Dumbbell Set (5–52.5 lbs)',
  'Quick adjust dial system. Replaces 15 sets of weights. Durable resin and steel construction. Compact storage with tray.',
  299.99, 40, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status)
SELECT
  (SELECT id FROM users WHERE email = 'seller.sports@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'sports-outdoors'),
  'Garmin Forerunner 255 GPS Watch',
  'Running GPS watch. Training readiness, daily suggested workouts, race time predictor. Up to 14-day battery. ANT+ & Bluetooth.',
  349.99, 35, 'ACTIVE';

-- =============================================================
-- PRODUCT IMAGES (using Unsplash Source / placehold.co for reliability)
-- =============================================================

-- Samsung Galaxy S24 Ultra
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', 0 FROM products WHERE name = 'Samsung Galaxy S24 Ultra';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=600', 1 FROM products WHERE name = 'Samsung Galaxy S24 Ultra';

-- iPhone 15 Pro
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 0 FROM products WHERE name = 'Apple iPhone 15 Pro';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1699013042249-3ae3ee1bb56c?w=600', 1 FROM products WHERE name = 'Apple iPhone 15 Pro';

-- OnePlus 12
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://placehold.co/600x600/1a1a2e/ffffff?text=OnePlus+12', 0 FROM products WHERE name = 'OnePlus 12';

-- MacBook Air M3
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 0 FROM products WHERE name = 'Apple MacBook Air M3';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600', 1 FROM products WHERE name = 'Apple MacBook Air M3';

-- Dell XPS 15
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600', 0 FROM products WHERE name = 'Dell XPS 15 OLED';

-- Sony WH-1000XM5
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 0 FROM products WHERE name = 'Sony WH-1000XM5 Headphones';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 1 FROM products WHERE name = 'Sony WH-1000XM5 Headphones';

-- AirPods Pro
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600', 0 FROM products WHERE name = 'Apple AirPods Pro (2nd Gen)';

-- Oxford Shirt
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 0 FROM products WHERE name = 'Classic Oxford Cotton Shirt';

-- Chino Pants
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', 0 FROM products WHERE name = 'Slim Fit Chino Pants';

-- Floral Maxi Dress
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', 0 FROM products WHERE name = 'Floral Maxi Dress';

-- Turtleneck Sweater
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600', 0 FROM products WHERE name = 'Cashmere Blend Turtleneck Sweater';

-- Instant Pot
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', 0 FROM products WHERE name = 'Instant Pot Duo 7-in-1';

-- KitchenAid Mixer
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 0 FROM products WHERE name = 'KitchenAid Stand Mixer';

-- Cutting Board
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600', 0 FROM products WHERE name = 'Bamboo Cutting Board Set (3-Piece)';

-- Atomic Habits
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 0 FROM products WHERE name = 'Atomic Habits by James Clear';

-- Pragmatic Programmer
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 0 FROM products WHERE name = 'The Pragmatic Programmer';

-- Dune
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 0 FROM products WHERE name = 'Dune by Frank Herbert';

-- Yoga Mat
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600', 0 FROM products WHERE name = 'Yoga Mat Pro (6mm)';

-- Dumbbells
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600', 0 FROM products WHERE name = 'Adjustable Dumbbell Set (5–52.5 lbs)';

-- Garmin Watch
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1523475496153-3c8f4e5be0a8?w=600', 0 FROM products WHERE name = 'Garmin Forerunner 255 GPS Watch';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600', 1 FROM products WHERE name = 'Garmin Forerunner 255 GPS Watch';

-- =============================================================
-- SAMPLE REVIEWS
-- =============================================================
INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra'),
  (SELECT id FROM users WHERE email = 'alice@shopverse.com'),
  5, 'Absolutely stunning phone! The 200MP camera is jaw-dropping. S Pen is super useful for note-taking. Battery lasts all day easily.';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra'),
  (SELECT id FROM users WHERE email = 'bob@shopverse.com'),
  4, 'Premium build quality, great display. Slightly pricey but worth it for the features. Highly recommended!';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Apple iPhone 15 Pro'),
  (SELECT id FROM users WHERE email = 'carol@shopverse.com'),
  5, 'The titanium frame feels incredible in hand. Camera system is exceptional for photos and video. USB-C finally!';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Apple MacBook Air M3'),
  (SELECT id FROM users WHERE email = 'alice@shopverse.com'),
  5, 'Insanely fast for everyday tasks, coding, and video editing. No fan noise at all. The battery life is genuinely 18 hours!';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Sony WH-1000XM5 Headphones'),
  (SELECT id FROM users WHERE email = 'bob@shopverse.com'),
  5, 'Best noise-cancelling headphones I have ever used. Crystal clear sound, incredibly comfortable for long sessions.';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Atomic Habits by James Clear'),
  (SELECT id FROM users WHERE email = 'carol@shopverse.com'),
  5, 'Life-changing book. The concept of 1% improvements compounded over time is so powerful. Read it twice already!';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Yoga Mat Pro (6mm)'),
  (SELECT id FROM users WHERE email = 'alice@shopverse.com'),
  4, 'Great grip, good thickness. The alignment lines are very helpful for beginners. Slight rubber smell at first but fades.';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Instant Pot Duo 7-in-1'),
  (SELECT id FROM users WHERE email = 'bob@shopverse.com'),
  5, 'Best kitchen appliance I own. Makes cooking so much faster and easier. Pressure cooking is a game changer!';

INSERT INTO reviews (product_id, buyer_id, rating, comment)
SELECT
  (SELECT id FROM products WHERE name = 'Floral Maxi Dress'),
  (SELECT id FROM users WHERE email = 'carol@shopverse.com'),
  5, 'Beautiful dress, perfect for summer. The fabric is so light and breezy. Got so many compliments wearing it!';
