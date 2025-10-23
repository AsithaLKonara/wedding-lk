import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { emailTemplateService } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
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
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
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
