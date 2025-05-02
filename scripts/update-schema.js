const mysql = require('mysql2/promise');

async function updateDatabase() {
  try {
    // Connect to the database
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Secure123!',
      database: 'bizz_portal',
      multipleStatements: true
    });

    // Add document_url column to invoices table
    await db.query(`
      ALTER TABLE invoices
      ADD COLUMN document_url VARCHAR(512) NULL;
    `);

    console.log('Database updated successfully');
    await db.end();

  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

updateDatabase();