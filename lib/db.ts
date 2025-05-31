import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'Secure123!', // replace with your MySQL password
  database: 'bizz_portal2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;