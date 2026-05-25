-- V5: Expand sample products to 5+ per category, all prices in INR
-- liquibase formatted sql
-- changeset marketplace:5

-- =============================================================
-- MORE SELLERS for new categories
-- =============================================================
INSERT INTO users (name, email, password_hash, role, enabled, email_verified) VALUES
('Beauty Palace',   'seller.beauty@shopverse.com',   '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE),
('ToyLand India',   'seller.toys@shopverse.com',     '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE),
('AutoMart India',  'seller.auto@shopverse.com',     '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm', 'SELLER', TRUE, TRUE);

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'Beauty Palace', 'Premium skincare, beauty and wellness products sourced from top brands.',
  'https://placehold.co/200x200/f472b6/ffffff?text=BP', TRUE
FROM users WHERE email = 'seller.beauty@shopverse.com';

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'ToyLand India', 'Educational toys, games and fun items for kids of all ages.',
  'https://placehold.co/200x200/8b5cf6/ffffff?text=TL', TRUE
FROM users WHERE email = 'seller.toys@shopverse.com';

INSERT INTO seller_profiles (user_id, shop_name, description, logo_url, approved)
SELECT id, 'AutoMart India', 'Quality car accessories, spare parts and automotive tools.',
  'https://placehold.co/200x200/64748b/ffffff?text=AM', TRUE
FROM users WHERE email = 'seller.auto@shopverse.com';

-- =============================================================
-- UPDATE EXISTING PRODUCTS to INR prices (multiply by ~83)
-- =============================================================
UPDATE products SET price = 99999.00 WHERE name = 'Samsung Galaxy S24 Ultra';
UPDATE products SET price = 84999.00 WHERE name = 'Apple iPhone 15 Pro';
UPDATE products SET price = 58999.00 WHERE name = 'OnePlus 12';
UPDATE products SET price = 91999.00 WHERE name = 'Apple MacBook Air M3';
UPDATE products SET price = 124999.00 WHERE name = 'Dell XPS 15 OLED';
UPDATE products SET price = 29999.00 WHERE name = 'Sony WH-1000XM5 Headphones';
UPDATE products SET price = 20999.00 WHERE name = 'Apple AirPods Pro (2nd Gen)';
UPDATE products SET price = 3999.00  WHERE name = 'Classic Oxford Cotton Shirt';
UPDATE products SET price = 4999.00  WHERE name = 'Slim Fit Chino Pants';
UPDATE products SET price = 5999.00  WHERE name = 'Floral Maxi Dress';
UPDATE products SET price = 10999.00 WHERE name = 'Cashmere Blend Turtleneck Sweater';
UPDATE products SET price = 7499.00  WHERE name = 'Instant Pot Duo 7-in-1';
UPDATE products SET price = 37499.00 WHERE name = 'KitchenAid Stand Mixer';
UPDATE products SET price = 2499.00  WHERE name = 'Bamboo Cutting Board Set (3-Piece)';
UPDATE products SET price = 1299.00  WHERE name = 'Atomic Habits by James Clear';
UPDATE products SET price = 3999.00  WHERE name = 'The Pragmatic Programmer';
UPDATE products SET price = 999.00   WHERE name = 'Dune by Frank Herbert';
UPDATE products SET price = 3499.00  WHERE name = 'Yoga Mat Pro (6mm)';
UPDATE products SET price = 24999.00 WHERE name = 'Adjustable Dumbbell Set (5–52.5 lbs)';
UPDATE products SET price = 28999.00 WHERE name = 'Garmin Forerunner 255 GPS Watch';

-- =============================================================
-- MOBILE PHONES — 2 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'mobile-phones'),
  'Realme GT 6', 'Snapdragon 8s Gen 3, 5500mAh battery, 120W fast charging, 50MP AI camera, 6.78-inch 120Hz AMOLED display.', 34999.00, 50, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'mobile-phones'),
  'Motorola Edge 50 Pro', 'Snapdragon 7 Gen 3, 125W TurboPower charging, 50MP OIS camera, IP68 rated, 6.7-inch pOLED display.', 31999.00, 40, 'ACTIVE';

-- Product images
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://placehold.co/600x600/ef4444/ffffff?text=Realme+GT+6', 0 FROM products WHERE name = 'Realme GT 6';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://placehold.co/600x600/1d4ed8/ffffff?text=Moto+Edge+50', 0 FROM products WHERE name = 'Motorola Edge 50 Pro';

-- =============================================================
-- LAPTOPS & COMPUTERS — 3 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'laptops-computers'),
  'ASUS ROG Strix G16', 'Intel Core i9-14900HX, RTX 4070 GPU, 16GB DDR5, 1TB NVMe SSD, 16-inch 240Hz QHD display. Ultimate gaming laptop.', 154999.00, 10, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'laptops-computers'),
  'HP Pavilion 15 Laptop', 'AMD Ryzen 5 7520U, 16GB RAM, 512GB SSD, 15.6-inch FHD IPS display. Great for students and everyday use.', 52999.00, 30, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'laptops-computers'),
  'Lenovo IdeaPad Slim 5', 'Intel Core i5-13420H, 16GB LPDDR5, 512GB SSD, 15.6-inch FHD display, backlit keyboard. Thin & lightweight.', 58999.00, 25, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', 0 FROM products WHERE name = 'ASUS ROG Strix G16';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600', 0 FROM products WHERE name = 'HP Pavilion 15 Laptop';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', 0 FROM products WHERE name = 'Lenovo IdeaPad Slim 5';

-- =============================================================
-- AUDIO — 3 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'JBL Flip 6 Bluetooth Speaker', 'IP67 waterproof, 12 hours playtime, bold JBL Pro sound, PartyBoost for multiple speakers. Compact and portable.', 9999.00, 80, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'boAt Airdopes 141', 'True wireless earbuds, ENx technology for clear calls, 42 hours total playback, ASAP charge, IPX4 water resistant.', 1299.00, 200, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.tech@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'audio'),
  'Bose QuietComfort 45', 'Wireless noise cancelling headphones. Aware mode for hearing surroundings. TriPort acoustic. 24 hours battery.', 24999.00, 30, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 0 FROM products WHERE name = 'JBL Flip 6 Bluetooth Speaker';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://placehold.co/600x600/0ea5e9/ffffff?text=boAt+Airdopes', 0 FROM products WHERE name = 'boAt Airdopes 141';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 0 FROM products WHERE name = 'Bose QuietComfort 45';

-- =============================================================
-- CLOTHING > MEN — 3 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-men'),
  'Premium Linen Kurta', 'Pure linen kurta with traditional hand-block print. Mandarin collar. Comfortable for both casual and festive wear. Sizes S-XXL.', 2499.00, 120, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-men'),
  'Denim Jacket Men', 'Classic washed denim jacket. Relaxed fit, chest pockets, button-down front. Versatile style for all seasons.', 3499.00, 80, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-men'),
  'Formal Blazer Men', 'Single-breasted slim fit blazer. 90% polyester 10% viscose. Notch lapel. Perfect for office and formal events.', 5999.00, 60, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', 0 FROM products WHERE name = 'Premium Linen Kurta';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', 0 FROM products WHERE name = 'Denim Jacket Men';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600', 0 FROM products WHERE name = 'Formal Blazer Men';

-- =============================================================
-- CLOTHING > WOMEN — 3 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-women'),
  'Silk Anarkali Suit', 'Elegant silk Anarkali suit with embroidery work. Comes with dupatta. Perfect for weddings and festive occasions.', 8999.00, 50, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-women'),
  'Crop Top & Palazzo Set', 'Stylish printed crop top with wide-leg palazzo pants. Viscose fabric, breathable and comfortable for everyday wear.', 2199.00, 100, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.fashion@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'clothing-women'),
  'Women Trench Coat', 'Classic double-breasted trench coat with belt. Water-resistant outer layer. Perfect for monsoon and winter.', 7999.00, 40, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600', 0 FROM products WHERE name = 'Silk Anarkali Suit';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', 0 FROM products WHERE name = 'Crop Top & Palazzo Set';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', 0 FROM products WHERE name = 'Women Trench Coat';

-- =============================================================
-- HOME & KITCHEN — 2 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.home@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'home-kitchen'),
  'Prestige Electric Kettle 1.5L', 'Auto shut-off, boil-dry protection, 360° rotational base. Concealed heating element. 1500W for rapid boiling.', 1299.00, 150, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.home@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'home-kitchen'),
  'Non-Stick Cookware Set (5-Piece)', 'Granite-coated non-stick pans and pots. PFOA-free, oven-safe up to 350°F. Includes fry pan, sauce pans, and stock pot.', 4999.00, 60, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 0 FROM products WHERE name = 'Prestige Electric Kettle 1.5L';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1584990347449-a4d9683c2f4a?w=600', 0 FROM products WHERE name = 'Non-Stick Cookware Set (5-Piece)';

-- =============================================================
-- BOOKS — 2 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.books@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'books'),
  'Rich Dad Poor Dad', 'Robert Kiyosaki''s classic on financial literacy. Learn about assets, liabilities, and the mindset of the rich. Paperback.', 499.00, 400, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.books@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'books'),
  'Clean Code by Robert C. Martin', 'A handbook of agile software craftsmanship. Must-read for every software developer. Hardcover, 431 pages.', 3299.00, 100, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://www.nicepng.com/png/detail/211-2115322_rich-dad-poor-dad-png-rich-dad-poor.png', 0 FROM products WHERE name = 'Rich Dad Poor Dad';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://m.media-amazon.com/images/I/41nUxzDHD-L.jpg', 0 FROM products WHERE name = 'Clean Code by Robert C. Martin';

-- =============================================================
-- SPORTS & OUTDOORS — 2 more (total = 5)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.sports@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'sports-outdoors'),
  'Nivia Storm Football (Size 5)', 'Official size and weight football. 32-panel machine-stitched design. PVC outer. Ideal for practice and matches.', 1299.00, 200, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.sports@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'sports-outdoors'),
  'Decathlon Resistance Bands Set', 'Set of 5 resistance bands (10–50kg). 100% natural latex. Includes carry bag and exercise guide. Great for home workouts.', 999.00, 300, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600', 0 FROM products WHERE name = 'Nivia Storm Football (Size 5)';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://m.media-amazon.com/images/I/312vEdxBqxL.jpg', 0 FROM products WHERE name = 'Decathlon Resistance Bands Set';

-- =============================================================
-- BEAUTY & HEALTH — 5 products (new category)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.beauty@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'beauty-health'),
  'Minimalist 10% Niacinamide Serum', 'Oil-free formula reduces excess oil production, minimizes pores, and improves uneven skin tone. 30ml. For all skin types.', 699.00, 300, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.beauty@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'beauty-health'),
  'Mamaearth Vitamin C Face Wash', 'Brightening face wash with Vitamin C and Turmeric. Removes tan, dark spots. Sulphate-free, paraben-free. 100ml.', 299.00, 500, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.beauty@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'beauty-health'),
  'Philips Beard Trimmer BT3231', 'Self-sharpening stainless steel blades, 5 length settings (1–5mm), 60-min cordless use, washable. DuraPower technology.', 1299.00, 100, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.beauty@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'beauty-health'),
  'Biotique Bio Kelp Protein Shampoo', 'Prevents hair loss. Bio Kelp extract & proteins. 650ml. For normal to oily hair. No sulfates.', 449.00, 250, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.beauty@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'beauty-health'),
  'Vega Keratin Hair Dryer', '2000W professional hair dryer with 2 heat settings and cool shot button. Ionic technology for frizz-free results. Lightweight.', 1899.00, 80, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', 0 FROM products WHERE name = 'Minimalist 10% Niacinamide Serum';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600', 0 FROM products WHERE name = 'Mamaearth Vitamin C Face Wash';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600', 0 FROM products WHERE name = 'Philips Beard Trimmer BT3231';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600', 0 FROM products WHERE name = 'Biotique Bio Kelp Protein Shampoo';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', 0 FROM products WHERE name = 'Vega Keratin Hair Dryer';

-- =============================================================
-- TOYS & GAMES — 5 products (new category)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.toys@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'toys-games'),
  'LEGO Classic Bricks Set (484 pcs)', '484 classic bricks in 33 vibrant colors. Encourages creativity and imagination. Suitable for ages 4+. Compatible with all LEGO sets.', 3999.00, 100, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.toys@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'toys-games'),
  'Funskool Ludo + Snakes & Ladders', 'Classic 2-in-1 board game. Includes one Ludo and one Snakes & Ladders game on the same board. For 2–4 players. Ages 5+.', 399.00, 300, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.toys@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'toys-games'),
  'Hot Wheels 20-Car Gift Pack', '20 die-cast cars in 1:64 scale. Assorted models. Great as gift for kids aged 3+. Collect all designs!', 1299.00, 150, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.toys@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'toys-games'),
  'Fisher-Price Laugh & Learn Smart Stages', 'Interactive plush toy puppy that talks, sings, and counts. 75+ songs and phrases. 3 Smart Stages learning levels for ages 6m–3yrs.', 2499.00, 80, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.toys@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'toys-games'),
  'Rubik''s Cube 3x3 Original', 'The original Rubik''s 3x3 Cube. Smooth rotation, vibrant colors. A timeless puzzle challenge for ages 8+.', 499.00, 400, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://toycra.com/cdn/shop/products/Lego-10696-Classic-Medium-Creative-Brick-Box-484-pcs-Construction-Lego-Toycra-2_512x512.jpg?v=1681467649', 0 FROM products WHERE name = 'LEGO Classic Bricks Set (484 pcs)';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://rukminim2.flixcart.com/image/416/416/xif0q/board-game/c/9/2/-original-imah8xsmqkjgyrrg.jpeg?q=70&crop=false', 0 FROM products WHERE name = 'Funskool Ludo + Snakes & Ladders';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', 0 FROM products WHERE name = 'Hot Wheels 20-Car Gift Pack';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://placehold.co/600x600/10b981/ffffff?text=Fisher+Price', 0 FROM products WHERE name = 'Fisher-Price Laugh & Learn Smart Stages';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images.unsplash.com/photo-1591107280024-de9e06a91e6a?w=600', 0 FROM products WHERE name = 'Rubik''s Cube 3x3 Original';

-- =============================================================
-- AUTOMOTIVE — 5 products (new category)
-- =============================================================
INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.auto@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'automotive'),
  'Michelin Car Dashboard Camera', '2.5K QHD front camera, 170° wide angle, loop recording, G-sensor, night vision, parking mode. Easy suction mount.', 6999.00, 60, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.auto@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'automotive'),
  'Amaron Go 44B20L Car Battery', '35Ah, maintenance-free car battery. Suits Maruti, Hyundai, Honda small cars. High cranking power, 36 month warranty.', 4599.00, 30, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.auto@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'automotive'),
  'Venting Car Phone Holder', '360° rotation, strong magnetic hold, one-touch release. Compatible with all smartphones. Easy air vent clip installation.', 699.00, 300, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.auto@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'automotive'),
  'Armor All Car Interior Kit', 'Interior cleaning kit: dashboard wipes, glass cleaner, tire foam, fabric freshener. Protects and shines all interior surfaces.', 1299.00, 150, 'ACTIVE';

INSERT INTO products (seller_id, category_id, name, description, price, stock_qty, status) SELECT
  (SELECT id FROM users WHERE email = 'seller.auto@shopverse.com'),
  (SELECT id FROM categories WHERE slug = 'automotive'),
  'Bosch Fuel Saver Windshield Wipers', 'Aerotwin flat blade design for streak-free wiping. Rust-resistant spoiler. Fits most cars. Set of 2. All-weather performance.', 1499.00, 200, 'ACTIVE';

INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://callmateindia.com/cdn/shop/files/Roadvoyager_H-23_Dash_cam-WEB-no_back_cam.jpg?v=1768994457&width=1000', 0 FROM products WHERE name = 'Michelin Car Dashboard Camera';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://www.batterybhai.com/common/uploaded_files/battery_image/A190E4A13F_1679989696_go-38b20l.jpg', 0 FROM products WHERE name = 'Amaron Go 44B20L Car Battery';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://images-na.ssl-images-amazon.com/images/I/81woLlSmlHL.jpg', 0 FROM products WHERE name = 'Venting Car Phone Holder';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://m.media-amazon.com/images/I/71NjOKTZy3L.jpg', 0 FROM products WHERE name = 'Armor All Car Interior Kit';
INSERT INTO product_images (product_id, url, display_order) SELECT id, 'https://www.wiperblades.co.uk/cdn/shop/files/715af8a0a8c3f9dd0601cdd31e3e72519e0b0916_076b29ee-b9cd-4d52-8f67-2bbe4577e731.png?v=1732020875&width=400', 0 FROM products WHERE name = 'Bosch Fuel Saver Windshield Wipers';
