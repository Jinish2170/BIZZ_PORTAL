-- MySQL Database Schema for BizzPortal
-- Run these SQL commands in your MySQL server to set up the database:

CREATE DATABASE IF NOT EXISTS bizz_portal2;
USE bizz_portal2;

-- 1. Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    category VARCHAR(100) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Budgets
CREATE TABLE IF NOT EXISTS budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    department VARCHAR(100) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status ENUM('paid', 'unpaid', 'overdue') NOT NULL DEFAULT 'unpaid',
    due_date DATE NOT NULL,
    issue_date DATE NOT NULL,
    description TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- 4. Documents
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    related_supplier_id INT DEFAULT NULL,
    url VARCHAR(500) NOT NULL,
    size VARCHAR(50),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (related_supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);
