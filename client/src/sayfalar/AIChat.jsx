import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  PaperAirplaneIcon, 
  XMarkIcon, 
  SparklesIcon, 
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'; 
import { sendMessageToGemini } from '../servisler/geminiService';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // İlk açılışta selamlama
  useEffect(() => {
    if (messages.length === 0) {
        handleSendInitialMessage();
    }
  }, []); 

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendInitialMessage = () => {
      try {
          const storedUser = localStorage.getItem('ogrenci');
          const user = storedUser ? JSON.parse(storedUser) : null;
          const userName = user?.adsoyad?.split(' ')[0] || "Öğrenci"; 
          
          setMessages([{
            id: 'welcome',
            role: 'model',
            text: `Selam ${userName} kanka! 👋 Vizia Kampüs asistanı burda. Akademik takvim bende, neyi merak ediyorsun?`, 
            timestamp: new Date()
          }]);
      } catch (error) {
          setMessages([{ id: 'welcome', role: 'model', text: 'Selam! Sana nasıl yardımcı olabilirim?', timestamp: new Date() }]);
      }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Kullanıcı mesajını ekrana bas
    const userMsg = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // 🧠 Geçmişi backend'in ve Gemini'nin istediği formata (parts yapısı) sokuyoruz
      const history = messages.map(m => ({ 
        role: m.role === 'model' ? 'model' : 'user', 
        parts: [{ text: m.text }] 
      }));
      
      // Son mesajı da ekle
      history.push({ role: 'user', parts: [{ text: currentInput }] });

      // 📤 Backend servisine gönder
      const responseText = await sendMessageToGemini(history);
      
      const modelMsg = {
        id: Date.now().toString() + '_model',
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
        console.error("Chat Hatası:", error);
        setMessages(prev => [...prev, { 
            id: 'err', 
            role: 'model', 
            text: 'Kanka bağlantıda bi sıkıntı çıktı. Backend (Port 5050) açık mı bi kontrol etsene?', 
            timestamp: new Date() 
        }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSend(); };

  return (
    <>
      {/* Chat Butonu */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-90 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
      </button>

      {/* Chat Penceresi */}
      <div className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-full sm:h-[600px] bg-white rounded-t-xl sm:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-10 sm:opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-red-600 text-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
            <div className="flex flex-col">
                <h2 className="text-sm font-black tracking-tighter uppercase italic">Vizia Asistan</h2>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Dudullu Campus Live</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:bg-black/20 p-1.5 rounded-xl transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                <div className="flex items-start gap-2">
                    {msg.role === 'model' && <ComputerDesktopIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />}
                    <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                </div>
                <span className={`block text-[9px] mt-2 ${msg.role === 'user' ? 'text-red-100' : 'text-gray-400'} text-right font-black uppercase tracking-tighter`}>
                  {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Kankan düşünüyor...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Alanı */}
        <div className="p-4 bg-white border-t border-gray-100 sm:rounded-b-2xl">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress} 
              placeholder="Sınavlar ne zaman kanka?" 
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400 font-medium" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()} 
              className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-30 shadow-lg"
            >
              <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};