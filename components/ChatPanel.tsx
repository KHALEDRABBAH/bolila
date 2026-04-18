'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock messages for frontend testing
const MOCK_MESSAGES = [
  { id: '1', text: 'Welcome to Bolila Support! How can we help you?', isSupport: true, time: '10:00 AM' },
  { id: '2', text: 'I have a question about my application.', isSupport: false, time: '10:05 AM' },
  { id: '3', text: 'Sure! Please provide your application reference number.', isSupport: true, time: '10:06 AM' }
];

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      isSupport: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // TODO: Connect to backend API for sending chat message
    // Simulate support reply for now
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. An agent will respond shortly.',
        isSupport: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 end-6 bg-gold hover:bg-gold/90 text-primary w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 z-50"
            aria-label="Open support chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 end-6 w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-100 sm:bottom-6 sm:end-6 bottom-0 end-0 sm:w-[350px] w-full sm:rounded-2xl rounded-t-2xl rounded-b-none"
            style={{ maxHeight: isMinimized ? 'auto' : '85vh' }}
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between shadow-sm cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm">Bolila Support</h3>
                  <p className="text-[10px] text-white/70">Typically replies in a few minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Input (Hidden when minimized) */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'calc(100% - 64px)', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col flex-1"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    <div className="text-center text-xs text-gray-400 mb-6">Today</div>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm flex flex-col ${
                          msg.isSupport 
                            ? 'bg-gray-100 text-gray-800 rounded-tl-sm' 
                            : 'bg-primary text-white rounded-tr-sm'
                        }`}>
                          <span>{msg.text}</span>
                          <span className={`text-[10px] mt-1 text-end ${msg.isSupport ? 'text-gray-400' : 'text-white/60'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSend} className="p-3 border-t bg-white flex items-end gap-2">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 max-h-32 min-h-[44px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
                      rows={1}
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="bg-gold text-primary p-2.5 rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-5 h-5 -ml-0.5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
