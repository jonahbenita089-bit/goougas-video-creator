import React, { useState } from 'react';
import { generateFromLocalLLM } from '../services/llmClient';

export default function ChatWidget() {
  const [prompt, setPrompt] = useState('Hello, help me create a short scene...');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  async function send() {
    if (!prompt.trim()) return;
    const userMsg = { role: 'user', text: prompt };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    try {
      const reply = await generateFromLocalLLM(prompt, { max_new_tokens: 256 });
      setMessages(m => [...m, userMsg, { role: 'assistant', text: reply }]);
      setPrompt('');
    } catch (err) {
      setMessages(m => [...m, userMsg, { role: 'assistant', text: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, maxWidth: 640 }}>
      <div style={{ maxHeight: 300, overflow: 'auto', marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '6px 0' }}>
            <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} style={{ width: '100%', marginBottom: 8 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={send} disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Thinking...' : 'Send'}</button>
        <button onClick={() => setPrompt('')} style={{ padding: '8px 12px' }}>Clear</button>
      </div>
    </div>
  );
}
