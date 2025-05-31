"use client"

import { useState, useEffect } from "react"
import { FileUp, Eye, Trash2, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
  PageContainer,
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageContent,
} from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Document {
  id: number;
  name: string;
  uploaded_by: string;
  upload_date: string;
  type: string;
  size: string;
  related_supplier_name?: string;
  url: string;
}

export default function DocumentsPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
        })
        return
      }

      // Check file type
      const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']
      const fileType = file.name.split('.').pop()?.toLowerCase()
      if (!fileType || !allowedTypes.includes(fileType)) {
        toast({
          title: "Error",
          description: "Invalid file type",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('uploaded_by', 'Current User') // Replace with actual user
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload document')

      await fetchDocuments()
      setSelectedFile(null)
      setUploadProgress(100)

      toast({
        title: "Document uploaded",
        description: "The document has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteDocument = async (id: number) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete document')

      await fetchDocuments()

      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
      })
    }
  }

  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
  }

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.type === "pdf" && <FileUp className="inline-block mr-2 h-4 w-4" />}
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "uploaded_by",
      header: "Uploaded By",
    },
    {
      accessorKey: "upload_date",
      header: "Upload Date",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal uppercase">
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "related_supplier_name",
      header: "Related Supplier",
      cell: ({ row }) => {
        const supplierName = row.getValue("related_supplier_name") as string | null
        return supplierName ? (
          <Badge variant="outline" className="font-normal">
            {supplierName}
          </Badge>
        ) : null
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original

        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => handlePreviewDocument(document)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Document</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this document? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteDocument(document.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageHeaderHeading>Documents</PageHeaderHeading>
          <PageHeaderDescription>Manage your documents and files</PageHeaderDescription>
        </div>
      </PageHeader>

      <PageContent>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <input
                type="file"
                id="document-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="document-upload"
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <FileUp className="mb-2 h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </span>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOCX, XLSX, JPG, PNG (max. 10MB)
                </span>
              </label>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Documents</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={columns} data={documents} searchPlaceholder="Search documents..." />
          </CardContent>
        </Card>
      </PageContent>

      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
            <DialogDescription>
              Uploaded by {previewDocument?.uploaded_by} on {previewDocument?.upload_date}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full bg-muted">
            {previewDocument && (
              <iframe
                src={previewDocument.url}
                className="w-full h-full"
                title={previewDocument.name}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Close
            </Button>
            <Button asChild>
              <a href={previewDocument?.url} download>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
