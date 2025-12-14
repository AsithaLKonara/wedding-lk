"use client"

import { useState } from 'react'
import { Paperclip, File, Image, FileText, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FileAttachmentProps {
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  onRemove?: () => void
  showRemove?: boolean
}

export function FileAttachment({ 
  fileName, 
  filePath, 
  fileSize, 
  fileType, 
  onRemove,
  showRemove = false 
}: FileAttachmentProps) {
  const [isUploading, setIsUploading] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    } else if (type === 'application/pdf') {
      return <FileText className="w-4 h-4" />
    } else {
      return <File className="w-4 h-4" />
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = filePath
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isImage = fileType.startsWith('image/')

  return (
    <Card className="max-w-xs">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {isImage ? (
              <img
                src={filePath}
                alt={fileName}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                {getFileIcon(fileType)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(fileSize)}
            </p>
            
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-6 px-2 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              
              {showRemove && onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FileUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        isDragOver 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Paperclip className="w-6 h-6 mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-600 mb-2">
        Drop files here or click to browse
      </p>
      <p className="text-xs text-gray-500">
        Images, PDF, Word docs, text files (max 10MB)
      </p>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  )
}
