import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, s.name as related_supplier_name 
      FROM documents d
      LEFT JOIN suppliers s ON d.related_supplier_id = s.id
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploaded_by = formData.get('uploaded_by') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create a unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const extension = path.extname(originalName)
    const filename = `${path.basename(originalName, extension)}-${timestamp}${extension}`
    
    // Save file to disk (you might want to use a cloud storage service in production)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await writeFile(path.join(uploadDir, filename), buffer)
    
    // Save file metadata to database
    const fileUrl = `/uploads/${filename}`
    const fileSize = Math.round(file.size / 1024) + ' KB'
    const fileType = extension.substring(1)

    const [result] = await pool.execute(
      'INSERT INTO documents (name, type, uploaded_by, url, size) VALUES (?, ?, ?, ?, ?)',
      [originalName, fileType, uploaded_by, fileUrl, fileSize]
    )

    return NextResponse.json({ 
      message: 'Document uploaded successfully',
      result
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error uploading document' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const body = await request.json()
    const { name, type, related_supplier_id } = body

    const [result] = await pool.execute(
      'UPDATE documents SET name = ?, type = ?, related_supplier_id = ? WHERE id = ?',
      [name, type, related_supplier_id, id]
    )

    return NextResponse.json({ 
      message: 'Document updated successfully',
      result
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Error updating document' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    // Get file URL before deleting the record
    const [[document]] = await pool.execute('SELECT url FROM documents WHERE id = ?', [id]) as any
    const fileUrl = document?.url

    // Delete database record
    const [result] = await pool.execute('DELETE FROM documents WHERE id = ?', [id])

    // Delete file if it exists
    if (fileUrl) {
      const relativePath = fileUrl.replace('/uploads/', '')
      const fullPath = path.join(process.cwd(), 'public', 'uploads', relativePath)
      try {
        await writeFile(fullPath, '')
      } catch (err) {
        console.error('Error deleting file:', err)
      }
    }

    return NextResponse.json({ 
      message: 'Document deleted successfully',
      result
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Error deleting document' }, { status: 500 })
  }
}