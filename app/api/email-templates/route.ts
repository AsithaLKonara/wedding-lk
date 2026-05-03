import { NextRequest, NextResponse } from 'next/server';
import { emailTemplateService } from '@/lib/email-templates';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let templates;
    if (category) {
      templates = emailTemplateService.getTemplatesByCategory(category);
    } else {
      templates = emailTemplateService.getAllTemplates();
    }

    return NextResponse.json({
      success: true,
      templates,
      total: templates.length
    });

  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateData = await request.json();
    
    const templateId = emailTemplateService.createTemplate(templateData);

    return NextResponse.json({
      success: true,
      templateId,
      message: 'Email template created successfully'
    });

  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
