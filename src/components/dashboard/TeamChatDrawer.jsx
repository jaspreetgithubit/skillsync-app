import React, { useState } from 'react';
import { X, Send, MessageSquare, Sparkles, Smile } from 'lucide-react';
import { useUserProfile } from '../../context/UserProfileContext';

export default function TeamChatDrawer({ isOpen, onClose, teamName, initialMessages = [] }) {
  const { userProfile } = useUserProfile();

  const [messages, setMessages] = useState(() => {
    return initialMessages.length > 0 ? initialMessages : [
      { id: 1, sender: 'Pooja Sundaram', avatar: '/images/avatars/pooja.jpg', time: '10:14 AM', text: 'Hey team! Super excited to kickoff sprint zero today.' },
      { id: 2, sender: 'Karthik Raja', avatar: '/images/avatars/karthik.jpg', time: '10:18 AM', text: 'I have set up the initial ROS2 multi-agent simulation sandbox.' },
      { id: 3, sender: 'Prof. Kulkarni', avatar: '/images/avatars/prof_kulkarni.jpg', time: '10:22 AM', text: 'Great progress. Let us sync on architecture at 2 PM.' }
    ];
  });

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: userProfile.name || 'You',
      avatar: userProfile.avatar || '/images/avatars/aditya.jpg',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMessage.trim(),
      isMe: true
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Sliding Drawer on the Right */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080B12]/98 border-l border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#080B12]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F59E0B]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{teamName} Channel</h3>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Encrypted Squad Room (Online)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isCurrentUser = m.isMe || m.sender === userProfile.name;

              return (
                <div 
                  key={m.id}
                  className={`flex gap-3 items-start ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={m.avatar || '/images/avatars/aditya.jpg'}
                    alt={m.sender}
                    className="w-8 h-8 rounded-full object-cover border border-white/15 shrink-0"
                  />
                  <div className={`max-w-[78%] space-y-1 ${isCurrentUser ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="font-bold text-white">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#080B12] font-semibold rounded-tr-none shadow-md shadow-amber-500/20' 
                        : 'bg-white/[0.04] text-slate-200 border border-white/10 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#080B12] flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send message to squad channel..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-amber-500 text-white text-xs outline-none transition-all placeholder:text-slate-500 font-sans"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2.5 rounded-xl btn-amber-gold disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-amber-500/25 shrink-0"
            >
              <Send className="w-4 h-4 text-[#080B12]" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
