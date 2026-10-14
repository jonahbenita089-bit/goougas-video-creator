// Simple client wrapper for the frontend to call the local LLM proxy
export async function generateFromLocalLLM(prompt, opts = {}) {
  const body = {
    prompt,
    max_new_tokens: opts.max_new_tokens || 256,
    temperature: opts.temperature || 0.7,
  };

  const res = await fetch('/api/llm/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('LLM request failed: ' + text);
  }

  const data = await res.json();
  // Try to extract common fields
  if (data && data.generated_text) return data.generated_text;
  if (data && data.results && data.results[0] && data.results[0].generated_text) return data.results[0].generated_text;
  return JSON.stringify(data);
}
