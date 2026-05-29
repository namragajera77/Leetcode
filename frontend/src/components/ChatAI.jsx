import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../utils/axiosClient';
import { Bot, Loader2, Send, Trash2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatAi({ problem, problemId }) {
  const getStorageKey = (key) => `chat_${problemId}_${key}`;
  const saveToStorage = (key, value) => {
    try { localStorage.setItem(getStorageKey(key), JSON.stringify(value)); } catch (error) { console.warn('Failed to save chat to localStorage:', error); }
  };
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(getStorageKey(key));
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn('Failed to load chat from localStorage:', error);
      return defaultValue;
    }
  };

  const defaultMessages = [
    {
      role: 'model',
      parts: [{ text: "Hello. I'm your AI coding assistant. Ask questions about coding problems, algorithms, data structures, and interview concepts." }],
    },
  ];

  const [messages, setMessages] = useState(() => loadFromStorage('messages', null) || defaultMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const clearTypingTimer = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const animateAssistantReply = (fullText) => {
    clearTypingTimer();
    const lines = String(fullText || '').split('\n');
    const assistantMessageId = Date.now();
    setMessages((prev) => [...prev, { id: assistantMessageId, role: 'model', parts: [{ text: '' }], isTyping: true }]);

    let currentIndex = 0;
    const tick = () => {
      currentIndex += 1;
      const nextText = lines.slice(0, currentIndex).join('\n');
      setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId ? { ...msg, parts: [{ text: nextText }], isTyping: currentIndex < lines.length } : msg));
      if (currentIndex < lines.length) typingTimerRef.current = setTimeout(tick, 120);
      else {
        typingTimerRef.current = null;
        setIsLoading(false);
      }
    };
    typingTimerRef.current = setTimeout(tick, 120);
  };

  useEffect(() => saveToStorage('messages', messages), [messages, problemId]);
  useEffect(() => () => clearTypingTimer(), []);
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;
    setIsLoading(true);
    const userMessage = { role: 'user', parts: [{ text: data.message }] };
    setMessages((prev) => [...prev, userMessage]);
    reset();

    try {
      const response = await axiosClient.post('/ai/chat', {
        messages: [...messages, userMessage],
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });
      animateAssistantReply(response.data.message);
    } catch (error) {
      console.error('API Error:', error);
      setMessages((prev) => [...prev, {
        role: 'model',
        parts: [{ text: "I'm having trouble reaching the assistant right now. Please try again in a moment." }],
      }]);
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    clearTypingTimer();
    setMessages(defaultMessages);
    localStorage.removeItem(getStorageKey('messages'));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-700/60 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-white">AI Coding Assistant</h3>
            <p className="text-xs font-semibold text-slate-500">{messages.length > 1 ? `${messages.length - 1} messages` : 'Ask questions about coding problems, algorithms, data structures, and interview concepts.'}</p>
          </div>
        </div>
        <button onClick={clearChat} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black text-slate-400 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:text-white" title="Clear chat">
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[86%] items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${msg.role === 'user' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-cyan-400/15 text-cyan-300'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`rounded-lg border px-4 py-3 text-sm leading-6 shadow-sm ${msg.role === 'user' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-50' : 'border-slate-700 bg-slate-900 text-slate-100'}`}>
                {msg.role === 'model' ? (
                  <div className={`chat-markdown ${msg.isTyping ? 'chat-typing' : ''}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.parts[0].text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-slate-700/60 bg-slate-900/80 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              placeholder="Ask questions about coding problems, algorithms, data structures, and interview concepts..."
              className="field-premium min-h-11 max-h-32 w-full resize-none px-4 py-3 text-sm"
              rows="1"
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 2, message: 'Message must be at least 2 characters' },
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
              disabled={isLoading}
            />
            {errors.message && <p className="mt-1 text-xs text-red-300">{errors.message.message}</p>}
          </div>
          <button type="submit" disabled={isLoading || errors.message} className="btn-primary-premium rounded-lg p-3 transition disabled:cursor-not-allowed disabled:opacity-50">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
