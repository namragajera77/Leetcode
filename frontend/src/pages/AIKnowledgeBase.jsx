import { useEffect, useRef, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Upload, FileText, Plus, Send, Trash2, Copy, X, Search } from 'lucide-react';

function Sidebar({ docs, onNewChat, onUploadClick, onClearChats, recentChats, onSelectChat }) {
  return (
    <aside className="w-72 shrink-0 border-r border-slate-800/60 bg-slate-950 p-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient text-slate-950">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-black text-white">AI Knowledge Base</div>
          <div className="text-xs text-slate-400">Interview notes RAG</div>
        </div>
      </div>

      <button onClick={onNewChat} className="mb-4 flex w-full items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-bold text-white hover:brightness-105">
        <Plus className="h-4 w-4" /> New Chat
      </button>

      <div className="mb-3 text-xs font-bold text-slate-400">Uploaded Documents</div>
      <div className="mb-4 max-h-36 overflow-y-auto space-y-2">
        {docs.length === 0 ? (
          <div className="text-xs text-slate-500">No PDFs yet</div>
        ) : (
          docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-md border border-slate-800/40 bg-slate-900 px-3 py-2 text-sm">
              <div className="truncate pr-2 text-slate-200">{d.name}</div>
              <button className="text-slate-400" title="Open document">
                <Search className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mb-6">
        <label className="w-full">
          <input type="file" accept="application/pdf" onChange={onUploadClick} className="hidden" />
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800/40 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900/80">
            <Upload className="h-4 w-4" /> Upload PDF
          </div>
        </label>
      </div>

      <div className="mb-2 text-xs font-bold text-slate-400">Recent Chats</div>
      <div className="space-y-2">
        {recentChats.length === 0 ? (
          <div className="text-xs text-slate-500">No chats yet</div>
        ) : (
          recentChats.map((c) => (
            <button key={c.id} onClick={() => onSelectChat(c)} className="w-full text-left rounded-md border border-slate-800/40 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900/70">
              {c.title}
            </button>
          ))
        )}
      </div>

      <div className="mt-6">
        <button onClick={onClearChats} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/5">
          <Trash2 className="h-4 w-4" /> Clear chats
        </button>
      </div>
    </aside>
  );
}

function Message({ m, isUser }) {
  return (
    <div className={`max-w-[75%] ${isUser ? 'ml-auto text-right' : ''}`}> 
      <div className={`${isUser ? 'inline-block rounded-l-lg rounded-tr-lg bg-cyan-600 text-slate-900' : 'inline-block rounded-r-lg rounded-tl-lg bg-slate-900 text-slate-200'} px-4 py-3 text-sm leading-6`}> 
        {m.content.type === 'text' ? (
          <div className="prose prose-invert max-w-none text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content.text}</ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-xs">{m.content.text}</pre>
        )}
      </div>
      <div className={`mt-1 text-[11px] ${isUser ? 'text-slate-400' : 'text-slate-500'}`}>{m.meta?.source ? `Source: ${m.meta.source}` : ''}</div>
    </div>
  );
}

export default function AIKnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleNewChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await axiosClient.post('/api/rag/upload', fd);
      // backend expected to return { id, name }
      setDocs((s) => [...s, { id: data.id || Date.now(), name: data.name || file.name }]);
    } catch (err) {
      console.error('Upload failed', err?.response?.data || err);
      alert(err?.response?.data?.message || 'Upload failed');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: { type: 'text', text: input }, meta: {} };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        chatId: selectedChat?.id || null,
        question: userMsg.content.text,
        docs: docs.map((d) => d.id),
      };
      const { data } = await axiosClient.post('/api/rag/chat', payload);
      // expected { answer: string, sources?: [] }
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: { type: 'text', text: data.answer || 'No answer' },
        meta: { sources: data.sources || [] },
      };
      setMessages((m) => [...m, aiMsg]);
      // save to recent chats
      setRecentChats((c) => [{ id: selectedChat?.id || Date.now(), title: userMsg.content.text.slice(0, 60) || 'New chat' }, ...c].slice(0, 10));
    } catch (err) {
      console.error('Chat error', err);
      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: { type: 'text', text: 'Error: failed to get answer.' }, meta: {} };
      setMessages((m) => [...m, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChats = () => {
    setRecentChats([]);
    setMessages([]);
    setSelectedChat(null);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="app-shell min-h-screen bg-slate-900/40">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 lg:px-8">
        <Sidebar
          docs={docs}
          onNewChat={handleNewChat}
          onUploadClick={handleUpload}
          recentChats={recentChats}
          onClearChats={handleClearChats}
          onSelectChat={(c) => setSelectedChat(c)}
        />

        <main className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-slate-950/60">
          <header className="flex items-center justify-between gap-4 border-b border-slate-800/60 px-6 py-4">
            <div>
              <div className="text-lg font-black text-white">AI Knowledge Base</div>
              <div className="text-sm text-slate-400">Chat with your interview preparation notes using AI-powered semantic search.</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => {}} className="rounded-md bg-slate-900/50 px-3 py-2 text-sm text-slate-200">Dark</button>
              <button onClick={handleClearChats} className="rounded-md border border-slate-800/40 px-3 py-2 text-sm text-rose-300">Clear</button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden lg:flex">
            <div className="flex-1 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center p-10">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center">
                    <h2 className="text-3xl font-black text-white">Ask Anything From Your Notes</h2>
                    <p className="mt-3 text-sm text-slate-400">Upload DSA, DBMS, OS, and CN notes and let AI help you prepare for interviews using Retrieval-Augmented Generation (RAG).</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button onClick={() => setInput('Explain BFS traversal')} className="rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-bold text-white">Explain BFS traversal</button>
                      <button onClick={() => setInput('What is Deadlock?')} className="rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-bold text-white">What is Deadlock?</button>
                      <button onClick={() => setInput('Difference between TCP and UDP')} className="rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-bold text-white">Difference between TCP and UDP</button>
                      <button onClick={() => setInput('Explain ACID properties')} className="rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-bold text-white">Explain ACID properties</button>
                    </div>

                    <div className="mt-8 text-sm text-slate-500">Supported documents: DSA, DBMS, OS, CN, Interview PDFs</div>
                  </motion.div>
                </div>
              ) : (
                <div ref={listRef} className="flex-1 overflow-auto p-6">
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <Message m={m} isUser={m.role === 'user'} />
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800" />
                        <div className="rounded-r-lg rounded-tl-lg bg-slate-900 px-4 py-3 text-sm text-slate-200">AI is typing...</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-800/60 px-4 py-3">
                <div className="flex gap-3">
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask questions about your notes, e.g. 'Explain BFS traversal'" className="min-h-[56px] max-h-36 w-full resize-none rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-200" />
                  <div className="flex flex-col gap-2">
                    <label className="w-full">
                      <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
                      <div className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-800/40 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                        <Upload className="h-4 w-4" /> Attach
                      </div>
                    </label>
                    <button onClick={handleSend} disabled={loading} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                      <Send className="h-4 w-4" /> Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden w-80 shrink-0 border-l border-slate-800/60 bg-slate-950 p-4 lg:block">
              <div className="text-sm font-black text-slate-300">Sources</div>
              <div className="mt-3 space-y-3">
                {/* Show last message sources */}
                {messages.length > 0 && messages[messages.length - 1].meta?.sources?.length > 0 ? (
                  messages[messages.length - 1].meta.sources.map((s, i) => (
                    <div key={i} className="rounded-md border border-slate-800/40 bg-slate-900 px-3 py-2 text-sm text-slate-200">{s}</div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500">Sources will appear here when available</div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
