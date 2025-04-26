const mysql = require('mysql2/promise');

async function initDatabase() {
  try {
    // First connect without database to create it
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Secure123!'
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS bizz_portal');
    await connection.end();

    // Now connect with the database selected
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Secure123!',
      database: 'bizz_portal',
      multipleStatements: true
    });

    // Create tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        category VARCHAR(100) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        spent DECIMAL(10,2) NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        size DECIMAL(10,2) NOT NULL,
        url VARCHAR(512) NOT NULL,
        uploaded_by VARCHAR(36) NOT NULL,
        uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category VARCHAR(100) NOT NULL,
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(36) PRIMARY KEY,
        number VARCHAR(50) NOT NULL UNIQUE,
        supplier_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('draft', 'pending', 'paid', 'cancelled') NOT NULL DEFAULT 'draft',
        due_date TIMESTAMP NOT NULL,
        issued_date TIMESTAMP NOT NULL,
        paid_date TIMESTAMP NULL,
        notes TEXT,
        created_by VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      );
    `);

    // Insert default admin user (password is admin123)
    await db.query(`
      INSERT IGNORE INTO users (id, name, email, password, role)
      VALUES (
        'admin',
        'Admin User',
        'admin@gmail.com',
        '$2b$10$BZH5YS4k2lGG4PKz3dCQj.e2yGJHY8Sy4Y9.dV7lVu8CCsIX6ozRa',
        'admin'
      );
    `);

    console.log('Database initialized successfully');
    await db.end();

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();