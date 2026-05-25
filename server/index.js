// server/index.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Gemini Proxy Endpoint
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (jsonErr) {
      console.error('Gemini API non-JSON response:', text);
      res.status(502).json({ error: 'Gemini API returned non-JSON', raw: text });
    }
  } catch (err) {
    res.status(500).json({ error: 'Gemini API error', details: err.message });
  }
});

// OpenAI Proxy Endpoint (ChatGPT, etc.)
app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      })
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (jsonErr) {
      console.error('OpenAI API non-JSON response:', text);
      res.status(502).json({ error: 'OpenAI API returned non-JSON', raw: text });
    }
  } catch (err) {
    res.status(500).json({ error: 'OpenAI API error', details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI proxy server running on port ${PORT}`);
});
