import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertCircle, Bot, Lightbulb, Loader2, X } from 'lucide-react';

const hintLevels = [
  { level: 1, title: 'Level 1', subtitle: 'Subtle hint' },
  { level: 2, title: 'Level 2', subtitle: 'Medium guidance' },
  { level: 3, title: 'Level 3', subtitle: 'Strong guidance' },
];

function HintModal({
  open,
  onClose,
  onSelectLevel,
  selectedLevel,
  loading,
  error,
  hint,
  generatedAt,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-md">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/90 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">AI Hint Generator</h2>
              <p className="text-sm text-slate-400">Receive intelligent hints that guide your thinking without revealing the complete solution.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close hint modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-black text-amber-300">
                <Bot className="h-4 w-4" />
                Choose Hint Level
              </div>
              <p className="text-xs leading-5 text-slate-400">Start subtle, then move stronger if you need more direction.</p>
            </div>

            <div className="space-y-2">
              {hintLevels.map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => onSelectLevel(item.level)}
                  disabled={loading}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedLevel === item.level
                      ? 'border-amber-400/40 bg-amber-400/10 text-white shadow-lg shadow-amber-400/10'
                      : 'border-slate-700/60 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  } ${loading ? 'opacity-80' : ''}`}
                >
                  <div className="text-sm font-black">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.subtitle}</div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 text-xs text-slate-400">
              Level 1 gives a nudge. Level 2 narrows the path. Level 3 gives a strong roadmap without revealing the answer.
            </div>
          </div>

          <div className="flex min-h-[360px] flex-col rounded-3xl border border-slate-700/60 bg-slate-900/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hint Output</p>
                <p className="text-sm text-slate-400">
                  {generatedAt ? `Generated at ${new Date(generatedAt).toLocaleTimeString()}` : 'Select a hint level to generate guidance.'}
                </p>
              </div>
              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-300">
                Level {selectedLevel}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-950/60 p-4">
              {loading ? (
                <div className="flex h-full min-h-[260px] items-center justify-center">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-slate-300">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-300" />
                    Generating hint...
                  </div>
                </div>
              ) : error ? (
                <div className="flex h-full min-h-[260px] items-center justify-center">
                  <div className="max-w-md rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-center text-sm text-red-200">
                    <div className="mb-2 flex items-center justify-center gap-2 font-black text-red-100">
                      <AlertCircle className="h-4 w-4" />
                      Hint generation failed
                    </div>
                    <p>{error}</p>
                  </div>
                </div>
              ) : hint ? (
                <div className="chat-markdown text-sm leading-7 text-slate-200">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {hint}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center text-center text-sm text-slate-500">
                  Pick a hint level to get a guided nudge for this problem.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HintModal;