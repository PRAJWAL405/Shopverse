-- V2: Seed Categories
-- liquibase formatted sql
-- changeset marketplace:2

INSERT INTO categories (name, slug, description, display_order) VALUES
('Electronics', 'electronics', 'Phones, laptops, gadgets and more', 1),
('Clothing', 'clothing', 'Fashion for everyone', 2),
('Home & Kitchen', 'home-kitchen', 'Everything for your home', 3),
('Books', 'books', 'Fiction, non-fiction, academic and more', 4),
('Sports & Outdoors', 'sports-outdoors', 'Equipment and gear for active lifestyles', 5),
('Beauty & Health', 'beauty-health', 'Skincare, wellness, and personal care', 6),
('Toys & Games', 'toys-games', 'Fun for all ages', 7),
('Automotive', 'automotive', 'Parts, accessories, and tools', 8);

-- Sub-categories for Electronics
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Mobile Phones', 'mobile-phones', 'Smartphones and accessories', id, 1 FROM categories WHERE slug = 'electronics';
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Laptops & Computers', 'laptops-computers', 'Laptops, desktops, and peripherals', id, 2 FROM categories WHERE slug = 'electronics';
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Audio', 'audio', 'Headphones, speakers, and earbuds', id, 3 FROM categories WHERE slug = 'electronics';

-- Sub-categories for Clothing
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Men', 'clothing-men', 'Menswear', id, 1 FROM categories WHERE slug = 'clothing';
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Women', 'clothing-women', 'Womenswear', id, 2 FROM categories WHERE slug = 'clothing';
