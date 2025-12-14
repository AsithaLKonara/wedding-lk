import { NextRequest, NextResponse } from 'next/server';
import { emailTemplateService } from '@/lib/email-templates';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const template = emailTemplateService.getTemplate(id);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();
    
    const success = emailTemplateService.updateTemplate(id, updates);

    if (!success) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email template updated successfully'
    });

  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = emailTemplateService.deleteTemplate(id);

    if (!success) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email template deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
