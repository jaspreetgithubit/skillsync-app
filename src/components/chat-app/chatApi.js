// Frontend client for the secure chat backend.
// No API key lives here: the browser only talks to /api/chat (proxied by Vite to the local backend).

export async function checkChatHealth() {
  try {
    const res = await fetch('/api/chat/health');
    if (!res.ok) return { ok: false, keyConfigured: false };
    return await res.json();
  } catch {
    return { ok: false, keyConfigured: false };
  }
}

/**
 * @param {{role: 'user'|'assistant', text: string}[]} messages full conversation, oldest first
 * @returns {Promise<string>}
 */
export async function sendChat(messages) {
  let res;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.map(({ role, text }) => ({ role, text })) })
    });
  } catch {
    throw new Error('Cannot reach the chat server. Start it with "npm run chat-server".');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 500 && !data.error) {
      throw new Error('Cannot reach the chat server. Start it with "npm run chat-server".');
    }
    throw new Error(data.error || `Request failed (HTTP ${res.status})`);
  }
  return data.reply;
}

