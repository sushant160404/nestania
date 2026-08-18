-- Nestania E-commerce Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS nestania CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nestania;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  addresses JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNumber VARCHAR(50) NOT NULL UNIQUE,
  userId INT,
  date DATE NOT NULL,
  status ENUM('ordered', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'ordered',
  items JSON NOT NULL,
  shippingAddress JSON NOT NULL,
  paymentMethod ENUM('upi', 'card', 'netbanking', 'cod') NOT NULL,
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  couponCode VARCHAR(50),
  estimatedDelivery VARCHAR(100),
  trackingSteps JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order_number (orderNumber),
  INDEX idx_user_id (userId),
  INDEX idx_status (status),
  INDEX idx_date (date),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId VARCHAR(50) NOT NULL,
  author VARCHAR(255) NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date DATE NOT NULL,
  title VARCHAR(255),
  comment TEXT NOT NULL,
  verifiedPurchase BOOLEAN DEFAULT FALSE,
  helpfulCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_id (productId),
  INDEX idx_rating (rating),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table (Optional - for storing product data in DB)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  originalPrice DECIMAL(10, 2),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  image TEXT NOT NULL,
  gallery JSON,
  rating DECIMAL(3, 2) DEFAULT 4.5,
  reviewsCount INT DEFAULT 0,
  inStock BOOLEAN DEFAULT TRUE,
  stockCount INT DEFAULT 100,
  isNew BOOLEAN DEFAULT FALSE,
  isBestSeller BOOLEAN DEFAULT FALSE,
  isSale BOOLEAN DEFAULT FALSE,
  tags JSON,
  materialCategory VARCHAR(100),
  colorFamily VARCHAR(50),
  patternType VARCHAR(50),
  occasionType VARCHAR(50),
  dimensions VARCHAR(255),
  weight VARCHAR(100),
  material VARCHAR(255),
  care TEXT,
  features JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_rating (rating),
  INDEX idx_stock (inStock),
  FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO users (name, email, phone, addresses) VALUES
('Sushant Namurte', 'sushantnamurte1604@gmail.com', '+91 87654 32100', 
 '[{"fullName":"Sushant Namurte","phone":"+91 87654 32100","street":"123, Triveni Nagar, Near ABC Chowk, Tathawade","city":"Pune","state":"Maharashtra","pincode":"411033","isDefault":true}]')
ON DUPLICATE KEY UPDATE name=name;
