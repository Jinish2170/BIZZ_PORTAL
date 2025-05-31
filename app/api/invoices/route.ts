import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Valid invoice statuses that match the database ENUM
const VALID_STATUSES = ['paid', 'unpaid', 'overdue'] as const;
type InvoiceStatus = typeof VALID_STATUSES[number];

interface InvoiceRow extends RowDataPacket {
  id: number;
  supplier_id: number;
  supplier_name?: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  issue_date: string;
  description: string | null;
  last_updated: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<InvoiceRow[]>(`
      SELECT i.*, s.name as supplier_name 
      FROM invoices i 
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY i.issue_date DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error fetching invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { 
      supplier_id, 
      amount, 
      status, 
      issue_date, 
      due_date, 
      description 
    } = await request.json();

    // Validate required fields
    if (!supplier_id || !amount || !issue_date || !due_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !VALID_STATUSES.includes(status as InvoiceStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Insert invoice
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO invoices (
        supplier_id, 
        amount,
        status, 
        issue_date, 
        due_date, 
        description
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        supplier_id,
        amount,
        status || 'unpaid',
        issue_date,
        due_date,
        description || null
      ]
    );

    const [[insertedInvoice]] = await pool.query<InvoiceRow[]>(
      'SELECT i.*, s.name as supplier_name FROM invoices i LEFT JOIN suppliers s ON i.supplier_id = s.id WHERE i.id = ?',
      [result.insertId]
    );

    return NextResponse.json(insertedInvoice);

  } catch (error: any) {
    console.error('Database error:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { error: 'Invalid supplier_id - supplier does not exist' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const { 
      supplier_id,
      amount,
      status,
      due_date,
      issue_date,
      description 
    } = await request.json();

    // Validate required fields
    if (!supplier_id || !amount || !status || !due_date || !issue_date) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate status
    if (!VALID_STATUSES.includes(status as InvoiceStatus)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE invoices SET supplier_id = ?, amount = ?, status = ?, due_date = ?, issue_date = ?, description = ? WHERE id = ?',
      [supplier_id, amount, status, due_date, issue_date, description, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const [[updatedInvoice]] = await pool.query<InvoiceRow[]>(
      'SELECT i.*, s.name as supplier_name FROM invoices i LEFT JOIN suppliers s ON i.supplier_id = s.id WHERE i.id = ?',
      [id]
    );

    return NextResponse.json(updatedInvoice);

  } catch (error: any) {
    console.error('Database error:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { error: 'Invalid supplier_id - supplier does not exist' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Error updating invoice' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM invoices WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Error deleting invoice' }, { status: 500 });
  }
}