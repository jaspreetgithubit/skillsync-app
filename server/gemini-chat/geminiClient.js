// server/gemini-chat/geminiClient.js
// Server-side wrapper around the Google Gemini REST API.
// The API key is read from process.env only and is NEVER sent to the browser.

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const REQUEST_TIMEOUT_MS = 30000;

const SYSTEM_INSTRUCTION =
  'You are SyncSkills AI, a friendly and accurate assistant inside the SyncSkills.AI ' +
  'team-formation platform. Answer any question clearly: maths (show steps), coding ' +
  '(use fenced code blocks), science, general knowledge, and questions about forming ' +
  'balanced project teams. Use concise Markdown formatting.';

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

function getConfig() {
  return {
    apiKey: (process.env.GEMINI_API_KEY || '').trim(),
    model: (process.env.GEMINI_MODEL || 'gemini-3.5-flash').trim()
  };
}

function isConfigured() {
  return Boolean(getConfig().apiKey);
}

/**
 * @param {{role: 'user'|'assistant', text: string}[]} messages full conversation, oldest first
 * @returns {Promise<string>} assistant reply text
 */
async function generateReply(messages) {
  const { apiKey } = getConfig();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not set in the local .env file.');
    err.status = 503;
    throw err;
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));

  // Try configured primary model first, with automatic fallback if Google servers are busy (503)
  const modelsToTry = Array.from(new Set(CANDIDATE_MODELS));
  let lastError = null;

  for (const currentModel of modelsToTry) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${GEMINI_BASE_URL}/${encodeURIComponent(currentModel)}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        }),
        signal: controller.signal
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If 503 (high demand) or 404 (model unavailable), attempt next model
        if (response.status === 503 || response.status === 404) {
          lastError = new Error(data?.error?.message || `HTTP ${response.status}`);
          continue;
        }
        const err = new Error(data?.error?.message || `Gemini API error (HTTP ${response.status})`);
        err.status = response.status === 429 ? 429 : 502;
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          err.message = 'Gemini rejected the request. Check that GEMINI_API_KEY in your .env is valid.';
        }
        throw err;
      }

      const text = (data.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || '')
        .join('')
        .trim();

      if (text) {
        return text;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        lastError = new Error('Gemini took too long to respond.');
        continue;
      }
      if (err.status && err.status !== 503) {
        throw err;
      }
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('Gemini is currently unavailable. Please try again in a moment.');
}

module.exports = { generateReply, isConfigured, getConfig };

