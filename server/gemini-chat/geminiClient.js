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

function getConfig() {
  return {
    apiKey: (process.env.GEMINI_API_KEY || '').trim(),
    model: (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim()
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
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not set in the local .env file.');
    err.status = 503;
    throw err;
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sent as a header (not in the URL) so the key never appears in logs.
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

    if (!text) {
      const reason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason;
      return reason
        ? `I couldn't generate a reply for that message (reason: ${reason}). Please try rephrasing.`
        : 'I could not generate a reply. Please try again.';
    }
    return text;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Gemini took too long to respond. Please try again.');
      timeoutErr.status = 504;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { generateReply, isConfigured, getConfig };

