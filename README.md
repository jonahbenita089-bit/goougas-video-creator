import React, { useMemo, useState } from 'react';
import { generateVideo, getVideoJob } from '../services/videoClient';

export default function VideoGeneratePanel() {
  const [prompt, setPrompt] = useState('A cinematic city at sunset, realistic, ultra detailed');
  const [mode, setMode] = useState('offline');
  const [provider, setProvider] = useState('hf');
  const [width, setWidth] = useState(768);
  const [height, setHeight] = useState(512);
  const [frames, setFrames] = useState(12);
  const [fps, setFps] = useState(4);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const providerList = useMemo(() => ['hf', 'replicate'], []);

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const payload = {
        prompt,
        mode,
        provider,
        width,
        height,
        frames,
        fps
      };

      const result = await generateVideo(payload);
      setJob(result);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function pollJob(jobId) {
    const current = await getVideoJob(jobId);
    setJob(current);
    if (current.status === 'running' || current.status === 'queued') {
      setTimeout(() => pollJob(jobId), 2000);
    }
  }

  return (
    <div style={{ maxWidth: 760, border: '1px solid #dfe3e8', borderRadius: 12, padding: 16, background: '#0b1020', color: '#edf4ff' }}>
      <h3 style={{ marginTop: 0 }}>Goougas Video Generator</h3>

      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          Prompt
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} style={{ width: '100%', marginTop: 6 }} />
        </label>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>
            Mode
            <select value={mode} onChange={e => setMode(e.target.value)} style={{ width: 160, display: 'block' }}>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </label>

          {mode === 'online' && (
            <label>
              Provider
              <select value={provider} onChange={e => setProvider(e.target.value)} style={{ width: 160, display: 'block' }}>
                {providerList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label>Width <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} /></label>
          <label>Height <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} /></label>
          <label>Frames <input type="number" value={frames} onChange={e => setFrames(Number(e.target.value))} /></label>
          <label>FPS <input type="number" value={fps} onChange={e => setFps(Number(e.target.value))} /></label>
        </div>

        <button onClick={handleGenerate} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, background: '#5b8cff', color: 'white', border: 'none' }}>
          {loading ? 'Generating...' : 'Generate video'}
        </button>

        {error && <div style={{ color: '#ffb0b0' }}>{error}</div>}

        {job && (
          <div style={{ borderTop: '1px solid #2c3e63', paddingTop: 12 }}>
            <div><strong>Job ID:</strong> {job.jobId || job.id}</div>
            <div><strong>Status:</strong> {job.status}</div>
            {job.message && <div>{job.message}</div>}
            {job.downloadUrl && (
              <a href={job.downloadUrl} target="_blank" rel="noreferrer" style={{ color: '#8cc8ff', display: 'inline-block', marginTop: 8 }}>
                Download video
              </a>
            )}
            {job.result && (
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, fontSize: 12 }}>{JSON.stringify(job.result, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
