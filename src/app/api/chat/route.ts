import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);


export async function POST(req: NextRequest) {
    const { message } = await req.json();
  
    // USER insert
    const session_id = req.headers.get('x-forwarded-for') ?? 'unknown';
    const { error: userError } = await supabase.from('chat_logs').insert([
      { session_id, sender: 'user', message }
    ]);
    if (userError) console.error('Supabase USER insert error:', userError);
  
    // OpenAI call...
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
  
    // BOT insert
    const { error: botError } = await supabase.from('chat_logs').insert([
      { session_id, sender: 'bot', message: reply }
    ]);
    if (botError) console.error('Supabase BOT insert error:', botError);
  
    return NextResponse.json({ reply });
  }
  