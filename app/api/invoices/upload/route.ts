import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const invoiceId = formData.get("invoiceId") as string;
    
    if (!file || !invoiceId) {
      return NextResponse.json(
        { success: false, error: { code: "VAL_001", message: "File and invoiceId are required" } },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(fileType)) {
      return NextResponse.json(
        { success: false, error: { code: "VAL_001", message: "Only PDF and Word documents are allowed" } },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileId = uuidv4();
    const fileName = `${fileId}-${file.name}`;
    const filePath = join(uploadDir, fileName);
    
    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Save file metadata to database
    const fileUrl = `/uploads/${fileName}`;
    const fileSize = file.size / 1024; // Size in KB
    
    // Get current user ID (in a real app, this would come from authentication)
    const userId = "admin"; // Using default admin ID from our setup
    
    const query = `
      INSERT INTO documents (id, name, type, size, url, uploaded_by, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(query, [
      uuidv4(),
      file.name,
      fileType,
      fileSize,
      fileUrl,
      userId,
      "invoice"
    ]);
    
    // Update invoice to reference this document
    const updateInvoiceQuery = `
      UPDATE invoices 
      SET document_url = ? 
      WHERE id = ?
    `;
    
    await db.query(updateInvoiceQuery, [fileUrl, invoiceId]);
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        fileName: file.name,
        fileUrl,
        fileSize,
        fileType 
      } 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to upload file" } },
      { status: 500 }
    );
  }
}