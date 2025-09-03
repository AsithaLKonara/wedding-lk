import { User } from '../models/user';
import { sendEmail } from '../email';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  required: boolean;
}

interface Document {
  id: string;
  userId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
}

class DocumentVerificationService {
  private static instance: DocumentVerificationService;
  private documentTypes: DocumentType[] = [
    {
      id: 'id_proof',
      name: 'Identity Proof',
      description: 'Government-issued ID card or passport',
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      required: true
    },
    {
      id: 'address_proof',
      name: 'Address Proof',
      description: 'Utility bill or bank statement',
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      required: true
    },
    {
      id: 'business_license',
      name: 'Business License',
      description: 'Business registration or license',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      required: false
    }
  ];

  private constructor() {}

  static getInstance(): DocumentVerificationService {
    if (!DocumentVerificationService.instance) {
      DocumentVerificationService.instance = new DocumentVerificationService();
    }
    return DocumentVerificationService.instance;
  }

  // Upload document
  async uploadDocument(
    userId: string,
    documentType: string,
    fileName: string,
    filePath: string
  ): Promise<Document> {
    try {
      // Validate document type
      const docType = this.getDocumentType(documentType);
      if (!docType) {
        throw new Error('Invalid document type');
      }

      // Create document record
      const document: Document = {
        id: this.generateId(),
        userId,
        documentType,
        fileName,
        filePath,
        uploadDate: new Date(),
        status: 'pending'
      };

      // Notify admins
      await this.notifyAdminsOfNewDocument(document);

      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Review document
  async reviewDocument(
    documentId: string, 
    status: 'approved' | 'rejected',
    verifiedBy: string,
    rejectionReason?: string
  ): Promise<Document> {
    try {
      // Find document (in real implementation, this would query database)
      const document: Document = {
        id: documentId,
        userId: 'user123',
        documentType: 'id_proof',
        fileName: 'document.pdf',
        filePath: '/uploads/document.pdf',
        uploadDate: new Date(),
        status,
        verifiedBy,
        verifiedAt: new Date()
      };

      if (status === 'rejected' && rejectionReason) {
        document.rejectionReason = rejectionReason;
      }

      // Notify user
      await this.notifyUserOfDocumentReview(document);

      return document;
    } catch (error) {
      console.error('Error reviewing document:', error);
      throw error;
    }
  }

  // Get document types
  getDocumentTypes(): DocumentType[] {
    return this.documentTypes;
  }

  // Get document type by ID
  getDocumentType(id: string): DocumentType | undefined {
    return this.documentTypes.find(dt => dt.id === id);
  }

  // Validate document before upload
  validateDocument(
    documentType: string, 
    fileSize: number, 
    mimeType: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const docType = this.getDocumentType(documentType);

    if (!docType) {
      errors.push('Invalid document type');
      return { isValid: false, errors };
    }

    if (fileSize > docType.maxFileSize) {
      errors.push(`File size exceeds maximum allowed (${docType.maxFileSize / (1024 * 1024)}MB)`);
    }

    if (!docType.allowedMimeTypes.includes(mimeType)) {
      errors.push(`File type not allowed. Allowed types: ${docType.allowedMimeTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async notifyAdminsOfNewDocument(document: Document): Promise<void> {
    try {
      const admins = await User.find({ role: { $in: ['admin', 'maintainer'] } });
      
      for (const admin of admins) {
        await sendEmail(
          admin.email,
          'New Document Verification Request',
          `New document verification request from user ${document.userId} for ${document.documentType}. File: ${document.fileName}. Submitted: ${document.uploadDate.toLocaleDateString()}. Please review in admin dashboard.`
        );
      }
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  }

  private async notifyUserOfDocumentReview(document: Document): Promise<void> {
    try {
      const user = await User.findById(document.userId);
      if (!user) return;

      const subject = document.status === 'approved' 
        ? 'Document Verification Approved' 
        : 'Document Verification Rejected';

      const message = document.status === 'approved'
        ? `Congratulations! Your ${document.documentType} has been approved. Your account verification status has been updated.`
        : `Your ${document.documentType} has been rejected for the following reason: ${document.rejectionReason}. Please review the requirements and submit a new document.`;

      await sendEmail(
        user.email,
        subject,
        message
      );
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }
}

export default DocumentVerificationService.getInstance(); 