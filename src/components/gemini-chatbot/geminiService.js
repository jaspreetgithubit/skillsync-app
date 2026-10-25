import { SYNCSKILLS_SYSTEM_PROMPT, FALLBACK_RESPONSES } from './chatbotKnowledge';

const GEMINI_STORAGE_KEY = 'syncskills_gemini_api_key';

export function getStoredGeminiKey() {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(GEMINI_STORAGE_KEY) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ''
  );
}

export function saveStoredGeminiKey(key) {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
}

/**
 * Sends a conversation to the Google Gemini API (gemini-1.5-flash)
 * If no key is set or the call fails, falls back to the local knowledge engine.
 */
export async function sendChatMessageToGemini(history, userMessage) {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    // Return intelligent knowledge-based response
    return getLocalKnowledgeResponse(userMessage);
  }

  // Format history for Gemini API
  const contents = [
    {
      role: 'user',
      parts: [{ text: `SYSTEM INSTRUCTIONS: ${SYNCSKILLS_SYSTEM_PROMPT}` }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I am the SyncSkills.AI Assistant powered by Google Gemini, ready to help with team formation, skills, projects, and platform guidance." }]
    }
  ];

  // Add previous conversational turns (up to last 6 messages)
  const recentHistory = history.slice(-6);
  recentHistory.forEach((turn) => {
    contents.push({
      role: turn.sender === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text }]
    });
  });

  // Add the current user query
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Gemini API returned status:', response.status, errorData);
      
      if (response.status === 400 || response.status === 403) {
        return `⚠️ **Gemini API Error (${response.status}):** The provided API key might be invalid or quota-restricted.\n\n*Falling back to SyncSkills Knowledge Engine:*\n\n${getLocalKnowledgeResponse(userMessage)}`;
      }
      return getLocalKnowledgeResponse(userMessage);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (textPart) {
      return textPart;
    }

    return getLocalKnowledgeResponse(userMessage);
  } catch (err) {
    console.error('Failed to communicate with Gemini API:', err);
    return getLocalKnowledgeResponse(userMessage);
  }
}

/**
 * High-accuracy fallback engine when offline or no API key is set
 */
function getLocalKnowledgeResponse(query) {
  const lower = query.toLowerCase();

  for (const item of FALLBACK_RESPONSES) {
    const match = item.keywords.some((kw) => lower.includes(kw));
    if (match) {
      return item.response;
    }
  }

  return `I am here to help you navigate **SyncSkills.AI**!\n\n- Ask me about **"How does team matching work?"**\n- Ask about **"Best tech stack for hackathons"**\n- Ask how to **"Find or create projects"**\n- Or click the ⚙️ icon above to connect your **Google Gemini API Key** for full generative answers!`;
}

