import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Send, Trash2, Pencil, Menu, X, ArrowLeft, Bot, User, MessageSquare, Check } from 'lucide-react';
import { sendChat, checkChatHealth } from './chatApi';
import { loadConversations, saveConversations, createConversation, titleFromMessage } from './chatStorage';

/* ---------- Minimal, safe Markdown renderer (no dangerouslySetInnerHTML) ---------- */
function renderInline(text, keyPrefix) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={key} className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-amber-200 text-[0.85em] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
    }
    return <span key={key}>{part}</span>;
  });
}

function MessageContent({ text }) {
  const blocks = text.split(/```/g);
  return (
    <div className="space-y-2 text-sm leading-relaxed break-words">
      {blocks.map((block, i) => {
        if (i % 2 === 1) {
          const newline = block.indexOf('\n');
          const lang = newline > -1 ? block.slice(0, newline).trim() : '';
          const code = newline > -1 ? block.slice(newline + 1) : block;
          return (
            <pre key={i} className="rounded-xl bg-black/60 border border-white/10 p-3 overflow-x-auto text-xs font-mono text-slate-200">
              {lang && <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1.5">{lang}</div>}
              <code>{code.replace(/\n$/, '')}</code>
            </pre>
          );
        }
        return block
          .split('\n')
          .map((line, j) => {
            if (!line.trim()) return <div key={`${i}-${j}`} className="h-1" />;
            const heading = line.match(/^#{1,6}\s+(.*)/);
            if (heading) {
              return <div key={`${i}-${j}`} className="font-bold text-slate-100 pt-1">{renderInline(heading[1], `${i}-${j}`)}</div>;
            }
            const bullet = line.match(/^\s*[-*]\s+(.*)/);
            if (bullet) {
              return (
                <div key={`${i}-${j}`} className="flex gap-2 pl-1">
                  <span className="text-amber-400">•</span>
                  <span>{renderInline(bullet[1], `${i}-${j}`)}</span>
                </div>
              );
            }
            return <p key={`${i}-${j}`}>{renderInline(line, `${i}-${j}`)}</p>;
          });
      })}
    </div>
  );
}

/* ---------- Main chat application ---------- */
export default function ChatApp({ onBackToHome }) {
  const [conversations, setConversations] = useState(() => {
    const saved = loadConversations();
    return saved.length ? saved : [createConversation()];
  });
  const [activeId, setActiveId] = useState(() => conversations[0]?.id);
  const [input, setInput] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [health, setHealth] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || conversations[0],
    [conversations, activeId]
  );
  const isLoading = loadingId === active?.id;

  useEffect(() => saveConversations(conversations), [conversations]);

  useEffect(() => {
    checkChatHealth().then(setHealth);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.messages.length, isLoading]);

  const updateConversation = (id, updater) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const handleNewChat = () => {
    // Reuse an existing empty chat instead of piling up blanks.
    const empty = conversations.find((c) => c.messages.length === 0);
    if (empty) {
      setActiveId(empty.id);
    } else {
      const fresh = createConversation();
      setConversations((prev) => [fresh, ...prev]);
      setActiveId(fresh.id);
    }
    setError('');
    setInput('');
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleDelete = (id) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (!next.length) {
        const fresh = createConversation();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const commitRename = () => {
    const title = editTitle.trim();
    if (editingId && title) updateConversation(editingId, (c) => ({ ...c, title }));
    setEditingId(null);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !active || loadingId) return;

    const convId = active.id;
    const userMsg = { id: `m-${Date.now()}`, role: 'user', text };
    const history = [...active.messages, userMsg];

    updateConversation(convId, (c) => ({
      ...c,
      title: c.messages.length === 0 ? titleFromMessage(text) : c.title,
      messages: history,
      updatedAt: Date.now()
    }));
    setInput('');
    setError('');
    setLoadingId(convId);

    try {
      const reply = await sendChat(history);
      updateConversation(convId, (c) => ({
        ...c,
        messages: [...c.messages, { id: `m-${Date.now()}-a`, role: 'assistant', text: reply }],
        updatedAt: Date.now()
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
      inputRef.current?.focus();
    }
  };

  const handleRetry = () => {
    // Remove last unanswered user message and put it back in the input box.
    const last = active?.messages[active.messages.length - 1];
    if (!last || last.role !== 'user') return;
    updateConversation(active.id, (c) => ({ ...c, messages: c.messages.slice(0, -1) }));
    setInput(last.text);
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  const sidebar = (
    <div className="h-full flex flex-col bg-[#0B0F18] border-r border-white/10">
      <div className="p-3 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleNewChat}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl btn-amber-gold text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 rounded-lg border border-white/10 text-slate-300 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">Chat history</div>
      <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {sorted.map((c) => {
          const isActive = c.id === active?.id;
          return (
            <div
              key={c.id}
              className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm cursor-pointer border ${
                isActive ? 'bg-amber-500/10 border-amber-500/30 text-slate-100' : 'border-transparent text-slate-400 hover:bg-white/[0.04]'
              }`}
              onClick={() => {
                setActiveId(c.id);
                setError('');
                setSidebarOpen(false);
              }}
            >
              <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              {editingId === c.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onBlur={commitRename}
                  className="flex-1 min-w-0 bg-black/40 border border-amber-500/40 rounded px-1.5 py-0.5 text-xs text-slate-100 outline-none"
                />
              ) : (
                <span className="flex-1 min-w-0 truncate">{c.title}</span>
              )}
              {editingId === c.id ? (
                <button onClick={(e) => { e.stopPropagation(); commitRename(); }} className="p-1 text-emerald-400 cursor-pointer" aria-label="Save title">
                  <Check className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingId(c.id); setEditTitle(c.title); }}
                    className="p-1 text-slate-500 hover:text-amber-300 cursor-pointer"
                    aria-label="Rename chat"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 text-[10px] font-mono text-slate-500 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${health?.keyConfigured ? 'bg-emerald-400' : health ? 'bg-rose-400' : 'bg-slate-500'}`} />
          {health === null ? 'Checking server…' : health.keyConfigured ? `Connected · ${health.model}` : health.ok ? 'Server up · key missing in .env' : 'Chat server offline'}
        </div>
        <div>Chats are saved only in this browser.</div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex bg-[#080B12] text-slate-200 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 shrink-0">{sidebar}</aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-72 max-w-[85%]">{sidebar}</div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main panel */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-white/10 bg-[#080B12]/90 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg border border-white/10 cursor-pointer" aria-label="Open sidebar">
            <Menu className="h-4 w-4" />
          </button>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-300 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <Bot className="h-5 w-5 text-amber-400 shrink-0" />
            <h1 className="text-sm font-bold truncate">{active?.title || 'SyncSkills AI Chat'}</h1>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {active?.messages.length === 0 && (
              <div className="text-center pt-16 space-y-3">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Bot className="h-7 w-7 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">How can I help you today?</h2>
                <p className="text-sm text-slate-400">Ask about maths, code, science or building your project team.</p>
                <div className="grid sm:grid-cols-2 gap-2 pt-4 max-w-xl mx-auto">
                  {['Solve 3x + 7 = 22 step by step', 'Write a Python function to reverse a linked list', 'Explain how a REST API works', 'What roles does a hackathon team need?'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); inputRef.current?.focus(); }}
                      className="text-left text-xs p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-amber-500/40 text-slate-300 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {active?.messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-amber-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-slate-100 whitespace-pre-wrap text-sm'
                      : 'bg-white/[0.04] border border-white/10 text-slate-300'
                  }`}
                >
                  {m.role === 'user' ? m.text : <MessageContent text={m.text} />}
                </div>
                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3" aria-live="polite">
                <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-amber-400" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white/[0.04] border border-white/10 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="sr-only">Gemini is thinking…</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs p-3 flex items-center justify-between gap-3">
                <span>{error}</span>
                <button onClick={handleRetry} className="shrink-0 underline hover:text-rose-200 cursor-pointer">Edit &amp; retry</button>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-white/10 bg-[#080B12] px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message SyncSkills AI…  (Enter to send, Shift+Enter for new line)"
              className="flex-1 resize-none max-h-40 min-h-[44px] rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500/60 px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || Boolean(loadingId)}
              className="h-11 w-11 shrink-0 rounded-xl btn-amber-gold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              {loadingId ? (
                <span className="h-4 w-4 rounded-full border-2 border-[#080B12] border-t-transparent animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="max-w-3xl mx-auto text-[10px] text-slate-500 mt-1.5 text-center">
            Gemini can make mistakes. Don&apos;t share passwords or private information.
          </p>
        </div>
      </main>
    </div>
  );
}

