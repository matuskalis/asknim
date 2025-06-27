import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();   // reads OPENAI_API_KEY later

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system',
        content:
          'You are Nim, a concise, friendly chatbot for a language-school website.' },
      { role: 'user', content: message }
    ]
  });
  return NextResponse.json({ reply: completion.choices[0].message.content });
}
