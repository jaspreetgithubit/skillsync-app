// server/gemini-chat/chatServer.js
// Standalone, secure backend for the SyncSkills Gemini chatbot.
//
// Run from the skillsync-app folder:
//   npm run chat-server
// (equivalent to: node --env-file=.env server/gemini-chat/chatServer.js)

const express = require('express');
const cors = require('cors');
const { generateReply, isConfigured, getConfig } = require('./geminiClient');

const PORT = Number(process.env.CHAT_SERVER_PORT) || 5050;
const MAX_MESSAGES = 40; // most recent turns forwarded to Gemini
const MAX_MESSAGE_CHARS = 8000;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST']
  })
);
app.use(express.json({ limit: '200kb' }));

// Health check: reports whether a key is configured, never the key itself.
app.get('/api/chat/health', (req, res) => {
  res.json({ ok: true, keyConfigured: isConfigured(), model: getConfig().model });
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '`messages` must be a non-empty array.' });
  }

  const cleaned = [];
  for (const m of messages.slice(-MAX_MESSAGES)) {
    if (!m || typeof m.text !== 'string' || !['user', 'assistant'].includes(m.role)) {
      return res.status(400).json({ error: 'Each message needs a role ("user" | "assistant") and text.' });
    }
    const text = m.text.trim();
    if (!text) continue;
    if (text.length > MAX_MESSAGE_CHARS) {
      return res.status(413).json({ error: `Messages must be under ${MAX_MESSAGE_CHARS} characters.` });
    }
    cleaned.push({ role: m.role, text });
  }

  // Gemini requires the conversation to start with a user turn.
  while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift();
  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'The last message must be from the user.' });
  }

  try {
    const reply = await generateReply(cleaned);
    res.json({ reply });
  } catch (err) {
    // Log only the message: never the request headers or key.
    console.error('[chat] Gemini error:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Unexpected server error.' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SyncSkills chat server running on http://localhost:${PORT}`);
    console.log(
      isConfigured()
        ? `Gemini key loaded from .env (model: ${getConfig().model})`
        : 'WARNING: GEMINI_API_KEY is missing. Add it to skillsync-app/.env and restart.'
    );
  });
}

module.exports = app;

