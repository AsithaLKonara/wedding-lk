import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import DocumentVerificationService from '@/lib/verification/document-verification';

// Mock document data for now (in real app, this would come from database)
const mockDocuments: Array<{
  id: string;
  userId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}> = [
  {
    id: 'doc1',
    userId: 'user123',
    documentType: 'id_proof',
    fileName: 'passport.pdf',
    filePath: '/uploads/passport.pdf',
    uploadDate: new Date(),
    status: 'pending'
  }
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!token?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentType, fileName, filePath } = await request.json();

    // Validate document
    const validation = DocumentVerificationService.validateDocument(
      documentType,
      1024 * 1024, // 1MB mock file size
      'application/pdf' // mock mime type
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid document', details: validation.errors },
        { status: 400 }
      );
    }

    // Create document record
    const document = {
      id: `doc_${Date.now()}`,
      userId: session.user.id,
      documentType,
      fileName,
      filePath,
      uploadDate: new Date(),
      status: 'pending' as const
    };

    // In real app, save to database
    mockDocuments.push(document);

    return NextResponse.json({
      success: true,
      document,
      message: 'Document uploaded successfully'
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!token?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || session.user.id;

    // Check if user is admin or requesting their own documents
    if (targetUserId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let documents = mockDocuments;

    // Filter by user if not admin
    if (session.user.role !== 'admin') {
      documents = documents.filter(doc => doc.userId === session.user.id);
    }

    // Filter by status if provided
    const status = searchParams.get('status');
    if (status) {
      documents = documents.filter(doc => doc.status === status);
    }

    return NextResponse.json({
      success: true,
      documents,
      total: documents.length
    });

  } catch (error) {
    console.error('Document retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve documents' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!token?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { documentId, status, rejectionReason } = await request.json();

    // Find document
    const documentIndex = mockDocuments.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Update document status
    mockDocuments[documentIndex].status = status;
    if (status === 'rejected' && rejectionReason) {
      mockDocuments[documentIndex].rejectionReason = rejectionReason;
    }

    return NextResponse.json({
      success: true,
      message: `Document ${status} successfully`,
      document: mockDocuments[documentIndex]
    });

  } catch (error) {
    console.error('Document update error:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!token?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Find and delete document
    const documentIndex = mockDocuments.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if user owns the document or is admin
    const document = mockDocuments[documentIndex];
    if (document.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    mockDocuments.splice(documentIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Document deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 