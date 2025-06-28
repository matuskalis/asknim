const { error: userError } = await supabase.from('chat_logs').insert([
    { session_id, sender: 'user', message }
  ]);
  if (userError) console.error('Supabase USER insert error:', userError);
  
  ...
  
  const { error: botError } = await supabase.from('chat_logs').insert([
    { session_id, sender: 'bot', message: reply }
  ]);
  if (botError) console.error('Supabase BOT insert error:', botError);
  