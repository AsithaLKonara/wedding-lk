import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { Middleware } from '@/lib/rbac/server';

async function postHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, targetPrice, currency = 'LKR', vendorType } = body;

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!groq) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
    }

    const systemPrompt = `You are an expert wedding business consultant. Generate a professional wedding service package for a ${vendorType || 'vendor'} in the ${category} category.
    
    Target Price: ${currency} ${targetPrice || 'Competitive pricing'}
    
    The response must be a JSON object with:
    - name (catchy and professional)
    - description (compelling and detailed)
    - type (basic, premium, or custom)
    - basePrice (number)
    - services (array of objects: { name, description, quantity, unitPrice, isIncluded, isRequired })
    - addons (array of objects: { name, description, price, isPopular })
    - pricingTiers (array of objects: { name, description, price, features })
    - tags (array of strings)
    
    Ensure the pricing is realistic and the services are appropriate for ${category}.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a ${category} package for around ${currency} ${targetPrice || 'standard'}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const packageData = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      success: true,
      data: packageData
    });

  } catch (error) {
    console.error('AI Package Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate package' }, { status: 500 });
  }
}

export const POST = Middleware.requireAuth(postHandler);
