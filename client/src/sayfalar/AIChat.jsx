import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  PaperAirplaneIcon, 
  XMarkIcon, 
  SparklesIcon, 
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'; 

import { sendMessageToGemini } from '../servisler/geminiService'; // Yeni oluşturduğumuz servis

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (messages.length === 0) {
        handleSendInitialMessage();
    }
  }, []); 

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendInitialMessage = async () => {
      setIsLoading(true);
      try {
          const responseText = await sendMessageToGemini([]); 
          setMessages([{
            id: 'welcome',
            role: 'model',
            text: responseText, 
            timestamp: new Date()
          }]);
      } catch (error) {
          console.error("İlk mesaj yükleme hatası:", error);
      } finally {
          setIsLoading(false);
      }
  };


  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const responseText = await sendMessageToGemini(history);
      
      const modelMsg = {
        id: Date.now().toString() + '_model',
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Gemini API hatası:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_error',
        role: 'model',
        text: 'Üzgünüm, şu anda sunucuya bağlanamıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Kayan Buton */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl transition-all duration-300 transform ${isOpen ? 'scale-0' : 'scale-100 hover:bg-red-700'}`}
        aria-label="Yapay Zeka Asistanını Aç"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
      </button>

      {/* Chat Arayüzü */}
      <div 
        className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-80 h-full sm:h-[500px] bg-white rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-0 sm:opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-red-600 text-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">Vizia Kampüs</h2> 
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-100 p-1 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-red-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <div className="flex items-start gap-2">
                    {msg.role === 'model' && <ComputerDesktopIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />}
                    
                    {/* 🔥🔥 KESİN DÜZELTME: \n karakterlerini <br/> etiketine çeviriyoruz 🔥🔥 */}
                    <p 
                        className="text-sm break-words"
                        // \n ve Markdown karakterlerini HTML'e dönüştürerek alt alta görünmesini sağlıyoruz.
                        dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*/g, '<b>').replace(/\*/g, '</b>').replace(/\n/g, '<br/>') }}
                    />
                </div>
                <span className={`block text-xs mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'} text-right`}>
                  {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Yükleniyor Göstergesi */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none shadow-md">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Alanı */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Örn: Final tarihleri ne zaman? Veya 'Bütünleme tarihleri'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};