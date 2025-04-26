import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const poolConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Secure123!',
  database: 'bizz_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = drizzle(poolConnection, { schema });

// Helper functions for common database operations
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await poolConnection.execute(sql, params);
  return rows as T;
}

export async function transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
  const connection = await poolConnection.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}