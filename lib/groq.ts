import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;

export const groq = groqApiKey ? new Groq({
  apiKey: groqApiKey,
}) : null;

export const GROQ_MODEL = "llama3-70b-8192";
export const GROQ_TOOL_MODEL = "llama3-70b-8192"; // Can be same or different if needed

export async function getGroqResponse(messages: any[], options: any = {}) {
  if (!groq) {
    throw new Error("Groq API key not configured");
  }

  const response = await groq.chat.completions.create({
    model: options.model || GROQ_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1000,
    ...options
  });

  return response.choices[0]?.message?.content || "";
}
