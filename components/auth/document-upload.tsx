'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  Download
} from 'lucide-react';

interface DocumentUploadProps {
  documentType: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: (fileId: string) => void;
  maxFileSize: number;
  allowedTypes: string[];
  required: boolean;
  uploadedFiles?: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
  }>;
  className?: string;
}

export function DocumentUpload({
  documentType,
  onUpload,
  onRemove,
  maxFileSize,
  allowedTypes,
  required,
  uploadedFiles = [],
  className = ''
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate file size
      if (file.size > maxFileSize) {
        throw new Error(`File size exceeds maximum allowed (${Math.round(maxFileSize / (1024 * 1024))}MB)`);
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload file
      await onUpload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, maxFileSize, allowedTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    disabled: uploading
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {required && <span className="text-red-500">*</span>}
          </CardTitle>
          <CardDescription>
            Upload your {documentType.replace(/_/g, ' ')} document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                  <Progress value={uploadProgress} className="mt-2" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">
                  Max size: {formatFileSize(maxFileSize)} | Allowed types: {allowedTypes.join(', ')}
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Uploaded Documents</CardTitle>
            <CardDescription>
              {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.mimeType)}
                    <div>
                      <p className="text-sm font-medium">{file.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)} • {file.mimeType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(file.status)}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(file.status)}
                        {file.status}
                      </div>
                    </Badge>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.url;
                          link.download = file.fileName;
                          link.click();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      {file.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(file.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {file.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      <strong>Rejection Reason:</strong> {file.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-800">Document Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• File must be clear and legible</li>
            <li>• Maximum file size: {formatFileSize(maxFileSize)}</li>
            <li>• Supported formats: {allowedTypes.join(', ')}</li>
            <li>• Document must be current and valid</li>
            <li>• All information must be clearly visible</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 