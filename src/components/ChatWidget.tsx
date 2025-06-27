'use client';
import { useState } from 'react';

export default function ChatWidget() {
  const [open, setOpen]   = useState(false);                       // bubble open/close
  const [input, setInput] = useState('');                          // user typing
  const [msgs,  setMsgs]  = useState<{from:'user'|'bot'; text:string}[]>([]); // chat log

  async function send() {
    if (!input.trim()) return;                                     // ignore empty
    const txt = input;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: txt }]);            // show user line

    const res  = await fetch('/api/chat', {                       // call our API
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: txt })
    });
    const data = await res.json();                                // { reply: "..." }
    setMsgs(m => [...m, { from: 'bot', text: data.reply }]);      // show bot reply
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-3">
        {open ? '×' : 'Chat'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* message list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === 'user'
                    ? 'text-right !text-gray-900'
                    : 'text-left text-indigo-600'
                }>
                {m.text}
              </div>
            ))}
          </div>

          {/* input row */}
          <div className="p-2 border-t flex">
          <input
            className="flex-1 border px-2 py-1 rounded text-gray-900"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Nim…"
          />

            <button
              onClick={send}
              className="ml-2 bg-indigo-600 text-white px-3 rounded">
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
