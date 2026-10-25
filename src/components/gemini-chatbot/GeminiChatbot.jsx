import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Key, 
  Trash2, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  sendChatMessageToGemini, 
  getStoredGeminiKey, 
  saveStoredGeminiKey 
} from './geminiService';
import { STARTER_SUGGESTIONS } from './chatbotKnowledge';

export default function GeminiChatbot({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [apiKey, setApiKey] = useState(getStoredGeminiKey());
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const idCounter = useRef(1);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm your **SyncSkills Gemini Copilot**. Ask me anything about our zero-bias AI team formation, NLP skill matching, projects, or hackathon compositions!",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isThinking) return;

    const currentId = idCounter.current++;
    const userMsg = {
      id: `user-${currentId}`,
      sender: 'user',
      text,
      time: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const botResponse = await sendChatMessageToGemini(messages, text);
      const botMsg = {
        id: `bot-${idCounter.current++}`,
        sender: 'bot',
        text: botResponse,
        time: 'Now'
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${idCounter.current++}`,
          sender: 'bot',
          text: "I couldn't reach the server right now. Feel free to ask another question or configure your Gemini API Key in settings ⚙️.",
          time: 'Now'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSaveKey = () => {
    saveStoredGeminiKey(tempApiKey);
    setApiKey(tempApiKey.trim());
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleClearKey = () => {
    saveStoredGeminiKey('');
    setApiKey('');
    setTempApiKey('');
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Conversation refreshed. How can I assist you with team matching or project collaboration today?",
        time: 'Just now'
      }
    ]);
  };

  // Helper to parse basic markdown like **bold**, *italic*, lists, and `code`
  const renderFormattedText = (raw) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;
          
          // Bullet point
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#F59E0B] font-black mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[-*]\s+/, '')) }} />
              </div>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(line.trim())) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-amber-400 font-mono font-bold">{line.match(/^\d+\./)[0]}</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\.\s+/, '')) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-amber-200">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-mono text-[11px]">$1</code>');
  };

  return (
    <>
      {/* =====================================================================
          FLOATING CHATBOT LAUNCH BUTTON (BOTTOM RIGHT)
          ===================================================================== */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle callout tooltip on hover */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080B12]/90 border border-amber-500/30 text-white text-xs font-mono backdrop-blur-md shadow-xl pointer-events-none animate-bounce duration-1000">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#F59E0B] font-bold">Ask Gemini Copilot</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Gemini AI Chatbot"
            className="group relative h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {/* Luminous Pulsing Aura */}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-300 border-2 border-[#080B12]" />
            </span>

            <div className="h-full w-full bg-[#080B12] rounded-[14px] flex items-center justify-center group-hover:bg-[#080B12]/80 transition-colors">
              <Bot className="h-6 w-6 text-[#F59E0B] group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* =====================================================================
          EXPANDED CHAT WINDOW (OBSIDIAN GLASSMORPHISM)
          ===================================================================== */}
      {isOpen && (
        <div 
          className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 flex flex-col bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-3xl transition-all duration-300 overflow-hidden ${
            isMinimized 
              ? 'w-[90vw] sm:w-[360px] h-[64px]' 
              : 'w-[92vw] sm:w-[420px] h-[82vh] max-h-[640px]'
          }`}
        >
          {/* HEADER BAR */}
          <div className="relative px-4 sm:px-5 py-3.5 bg-[#080B12]/90 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-[#F59E0B]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-tight truncate">
                    SyncSkills Gemini
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-[#F59E0B] border border-amber-500/30">
                    1.5 AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  <span>{apiKey ? 'Live Gemini Connected' : 'SyncSkills Engine (Ready)'}</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                title="Gemini API Key Settings"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  showSettings 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-amber-500/30'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-amber-500/30 transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* SETTINGS DRAWER (API KEY CONFIGURATION) */}
              {showSettings && (
                <div className="p-4 bg-[#080B12]/95 border-b border-amber-500/20 space-y-3 shrink-0 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F59E0B] font-bold flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      <span>Google Gemini API Configuration</span>
                    </span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Paste Gemini API key (AIzaSy...)"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] text-white text-xs font-mono outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Key</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveKey}
                      className="px-3.5 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#080B12] text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      {keySavedMessage ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <span>Save Key</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* MESSAGES THREAD AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/40 text-slate-100 shadow-lg'
                          : 'bg-white/[0.04] border border-white/10 text-slate-200 shadow-md backdrop-blur-md'
                      }`}
                    >
                      {msg.sender === 'bot' ? (
                        renderFormattedText(msg.text)
                      ) : (
                        <p className="text-xs whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}

                {/* Thinking Indicator */}
                {isThinking && (
                  <div className="flex items-start gap-2">
                    <div className="px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B] animate-bounce" />
                      <span>Gemini is generating response...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* NAVIGATION ACTION CHIPS */}
              {onNavigate && (
                <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/[0.05] flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Actions:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('/choose-purpose');
                      setIsOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono text-amber-300 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('/explore-projects');
                      setIsOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[10px] font-mono text-slate-300 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Explore Catalog</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}

              {/* STARTER SUGGESTIONS (IF FEW MESSAGES) */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 border-t border-white/[0.06] bg-white/[0.01]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Suggested Questions:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {STARTER_SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(s.prompt)}
                        className="p-2 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.08] hover:border-amber-500/40 text-left transition-all cursor-pointer group flex items-start gap-1.5"
                      >
                        <span className="text-xs">{s.icon}</span>
                        <span className="text-[10px] text-slate-300 group-hover:text-amber-200 line-clamp-2 leading-tight">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUT BAR */}
              <div className="p-3 bg-[#080B12]/95 border-t border-white/10 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask Gemini anything..."
                      className="w-full pl-3 pr-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] text-white text-xs outline-none transition-colors placeholder:text-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isThinking}
                    className="h-10 w-10 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#080B12] flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </form>

                {/* Footer Micro Links */}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>SyncSkills AI Privacy</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

