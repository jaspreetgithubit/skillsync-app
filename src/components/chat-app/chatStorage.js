// Stores ONLY conversations created inside this app, in this browser's localStorage.
// Nothing here reads, imports or uploads any external ChatGPT / Gemini history.

const STORAGE_KEY = 'syncskills_chat_app_conversations_v1';

export function loadConversations() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // storage full or unavailable: ignore, chat still works in memory
  }
}

export function createConversation() {
  const now = Date.now();
  return {
    id: `chat-${now}-${Math.random().toString(36).slice(2, 7)}`,
    title: 'New chat',
    messages: [],
    createdAt: now,
    updatedAt: now
  };
}

export function titleFromMessage(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 40 ? `${clean.slice(0, 40)}…` : clean || 'New chat';
}

