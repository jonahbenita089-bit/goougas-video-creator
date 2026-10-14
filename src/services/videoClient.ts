export async function generateVideo(payload) {
  const response = await fetch('http://localhost:5174/api/generate/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Video generation request failed');
  }

  return response.json();
}

export async function getVideoJob(jobId) {
  const response = await fetch(`http://localhost:5174/api/generate/video/${jobId}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch video job');
  }
  return response.json();
}
