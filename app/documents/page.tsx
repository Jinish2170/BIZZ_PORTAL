"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileUp, Eye, Trash2, FileText, FileImage, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useStore, type Document } from "@/lib/store"

export default function DocumentsPage() {
  const { toast } = useToast()
  const { documents, addDocument, deleteDocument } = useStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    // Simulate upload progress
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // Add the document after upload completes
          addDocument({
            name: selectedFile.name,
            uploadedBy: "Current User",
            type: selectedFile.name.split(".").pop() || "",
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            tags: ["New"],
          })

          setSelectedFile(null)

          // Reset the file input
          const fileInput = document.getElementById("document-upload") as HTMLInputElement
          if (fileInput) fileInput.value = ""

          toast({
            title: "Document uploaded",
            description: "The document has been uploaded successfully.",
          })

          return 0
        }
        return prev + 10
      })
    }, 300)
  }

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id)

    toast({
      title: "Document deleted",
      description: "The document has been deleted successfully.",
    })
  }

  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document)
    setIsPreviewOpen(true)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "xlsx":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-500" />
      case "png":
      case "jpg":
      case "jpeg":
        return <FileImage className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const columns: ColumnDef<Document>[] = [
    {
      id: "name",
      header: "Document Name",
      cell: ({ row }) => {
        const document = row.original
        return (
          <div className="flex items-center gap-2">
            {getFileIcon(document.type)}
            <span className="font-medium">{document.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
    },
    {
      accessorKey: "uploadedDate",
      header: "Uploaded Date",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const document = row.original
        return (
          <div className="flex flex-wrap gap-1">
            {document.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">Upload and manage your business documents</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Upload Document</h2>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="flex-1">
                  <input id="document-upload" type="file" className="hidden" onChange={handleFileChange} />
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
                    className="self-stretch md:self-end"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : "Upload"}
                  </Button>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DataTable columns={columns} data={documents} searchPlaceholder="Search documents..." />
      </motion.div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {previewDocument && (
            <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-gray-50 dark:bg-gray-800 min-h-[300px]">
              <div className="text-6xl mb-4">{getFileIcon(previewDocument.type)}</div>
              <h3 className="text-lg font-medium">{previewDocument.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                <Badge variant="outline">{previewDocument.type.toUpperCase()}</Badge>
                <Badge variant="outline">{previewDocument.size}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Uploaded by {previewDocument.uploadedBy} on {previewDocument.uploadedDate}
              </p>
              <div className="flex flex-wrap gap-1 mt-4 justify-center">
                {previewDocument.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-6 text-sm text-center text-muted-foreground">
                This is a preview placeholder. In a real application, the document would be displayed or downloaded
                here.
              </p>
              <Button className="mt-4">Download Document</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
