import { sql } from 'drizzle-orm';
import { mysqlTable, varchar, decimal, timestamp, text, enum as mysqlEnum } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'user']).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
});

export const suppliers = mysqlTable('suppliers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contact: varchar('contact', { length: 255 }).notNull(),
  status: mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  category: varchar('category', { length: 100 }).notNull(),
  lastUpdated: timestamp('last_updated').onUpdateNow(),
});

export const budgets = mysqlTable('budgets', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  spent: decimal('spent', { precision: 10, scale: 2 }).notNull().default('0'),
  category: varchar('category', { length: 100 }).notNull(),
  status: mysqlEnum('status', ['active', 'completed', 'cancelled']).notNull().default('active'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  lastUpdated: timestamp('last_updated').onUpdateNow(),
});

export const documents = mysqlTable('documents', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  size: decimal('size', { precision: 10, scale: 2 }).notNull(),
  url: varchar('url', { length: 512 }).notNull(),
  uploadedBy: varchar('uploaded_by', { length: 36 }).notNull().references(() => users.id),
  uploadedDate: timestamp('uploaded_date').defaultNow(),
  category: varchar('category', { length: 100 }).notNull(),
});

export const invoices = mysqlTable('invoices', {
  id: varchar('id', { length: 36 }).primaryKey(),
  number: varchar('number', { length: 50 }).notNull().unique(),
  supplierId: varchar('supplier_id', { length: 36 }).notNull().references(() => suppliers.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum('status', ['draft', 'pending', 'paid', 'cancelled']).notNull().default('draft'),
  dueDate: timestamp('due_date').notNull(),
  issuedDate: timestamp('issued_date').notNull(),
  paidDate: timestamp('paid_date'),
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 36 }).notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
});