require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5173;
const MODEL_NAME = process.env.MODEL_NAME || 'model';

app.post('/api/llm/generate', async (req, res) => {
  try {
    const { prompt, max_new_tokens = 256, temperature = 0.7, model } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt in request body' });

    const targetModel = model || MODEL_NAME;

    const baseUrl = process.env.LLM_URL || `http://localhost:8080/v1/models/${targetModel}/generate`;

    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: max_new_tokens,
        temperature: temperature
      }
    };

    // Forward request to local LLM server
    const llmResp = await axios.post(baseUrl, payload, { timeout: 120000 });

    // Return the LLM server response unchanged so caller can inspect tokens/format
    return res.json(llmResp.data);
  } catch (err) {
    console.error('LLM proxy error', err?.toString ? err.toString() : err);
    return res.status(500).json({ error: err?.toString ? err.toString() : String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`LLM proxy server listening on http://localhost:${PORT}`);
});
