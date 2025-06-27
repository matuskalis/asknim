import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// OpenAI – načíta OPENAI_API_KEY z env
const openai = new OpenAI();

// Supabase client – číta SUPABASE_URL + SUPABASE_ANON_KEY z env
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // ---------- 1. uložíme užívateľovu správu ----------
  const session_id = req.headers.get('x-forwarded-for') ?? 'unknown';
  await supabase.from('chat_logs').insert([
    { session_id, sender: 'user', message }
  ]);

  // ---------- 2. zavoláme OpenAI ----------
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are Nim, a concise, friendly chatbot for a language-school website.'
      },
      { role: 'user', content: message }
    ]
  });

  const reply = completion.choices[0].message.content;

  // ---------- 3. uložíme odpoveď bota ----------
  await supabase.from('chat_logs').insert([
    { session_id, sender: 'bot', message: reply }
  ]);

  return NextResponse.json({ reply });
}
