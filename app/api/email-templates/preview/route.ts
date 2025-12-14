import { NextRequest, NextResponse } from 'next/server';
import { emailTemplateService, EmailVariables } from '@/lib/email-templates';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, variables } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const rendered = emailTemplateService.renderTemplate(templateId, variables as EmailVariables);

    if (!rendered) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      preview: rendered
    });

  } catch (error) {
    console.error('Error previewing email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
