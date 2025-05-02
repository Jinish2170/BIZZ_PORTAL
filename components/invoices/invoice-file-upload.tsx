"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileUp, Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InvoiceFileUploadProps {
  invoiceId: string
}

export function InvoiceFileUpload({ invoiceId }: InvoiceFileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      // Check if file is PDF or Word document
      if (
        selectedFile.type === "application/pdf" || 
        selectedFile.type === "application/msword" || 
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
        setUploadSuccess(false)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("invoiceId", invoiceId)
      
      const response = await fetch("/api/invoices/upload", {
        method: "POST",
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUploadSuccess(true)
        setFileUrl(result.data.fileUrl)
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`,
        })
      } else {
        toast({
          title: "Upload failed",
          description: result.error?.message || "An error occurred during upload",
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "An error occurred during upload. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Invoice Document</CardTitle>
        <CardDescription>
          Upload a PDF or Word document for invoice #{invoiceId.slice(0, 8)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => document.getElementById("invoice-file-input")?.click()}
          >
            {uploadSuccess ? (
              <div className="flex flex-col items-center space-y-2 text-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
                <p className="text-sm font-medium">File uploaded successfully</p>
                <p className="text-xs text-muted-foreground">{file?.name}</p>
                <Button variant="link" size="sm" asChild>
                  <a href={fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <File className="h-4 w-4 mr-1" /> View Document
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-center">
                <FileUp className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">Drag & drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX (Max 10MB)</p>
                {file && (
                  <div className="flex items-center mt-2 p-2 bg-muted rounded-md">
                    <File className="h-4 w-4 mr-2" />
                    <span className="text-xs font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            )}
            <Input 
              id="invoice-file-input"
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={handleFileChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading || uploadSuccess}
        >
          {isUploading ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" /> Upload Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}