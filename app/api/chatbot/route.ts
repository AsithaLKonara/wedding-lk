import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      response: "Hello! I'm the WeddingLK AI Assistant. How can I help you plan your perfect wedding today?",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chatbot request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], context = {} } = await request.json();

    if (!groq) {
      return NextResponse.json({
        response: {
          text: "I'm sorry, my AI brain is currently offline. Please try again later!",
          type: 'error'
        }
      });
    }

    const systemPrompt = `You are WeddingLK AI, the ultimate wedding planning assistant for Sri Lankan weddings. 
    Your goal is to help users find venues, vendors, and plan their wedding with ease.
    
    Context:
    - User Details: ${JSON.stringify(context.user || {})}
    - Current Page: ${context.currentPage || 'Unknown'}
    - Wedding Details: ${JSON.stringify(context.wedding || {})}
    
    Instructions:
    1. Be friendly, professional, and culturally aware of Sri Lankan wedding traditions (Poruwa, Kandyan, Hindu, Muslim, etc.).
    2. Provide actionable advice.
    3. If asked about venues or vendors, suggest they use the "AI Search" feature for specific listings.
    4. Keep responses concise but helpful.
    5. You can provide "suggestions" (quick reply chips) at the end of your response if applicable.
    
    Format your response as a JSON object:
    {
      "text": "Your message here",
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "type": "chat"
    }`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chatbot request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


