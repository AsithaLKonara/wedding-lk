import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emailTemplateService, EmailVariables } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
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
