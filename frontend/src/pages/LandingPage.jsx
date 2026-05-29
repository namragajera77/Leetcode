import { Link } from 'react-router';
import { ArrowRight, Bot, CheckCircle2, Code2, Eye, Gauge, Sparkles, TerminalSquare } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Visual algorithm learning',
    description: 'See the important states of an algorithm instead of staring at dry theory.',
  },
  {
    icon: TerminalSquare,
    title: 'Focused coding workspace',
    description: 'Practice with a clean editor, test output, submissions, and problem context.',
  },
  {
    icon: Bot,
    title: 'AI-guided debugging',
    description: 'Ask for hints, edge cases, and explanations when your solution gets stuck.',
  },
];

const stats = [
  ['3', 'Languages'],
  ['Judge', 'Execution'],
  ['AI', 'Assistant'],
];

const LandingPage = () => (
  <main className="min-h-screen bg-[#080b12] text-slate-100">
    <nav className="sticky top-0 z-40 border-b border-slate-700/40 bg-slate-950/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg accent-gradient text-slate-950 shadow-lg shadow-cyan-500/20">
            <Code2 className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-xl font-black leading-tight text-white">AI-Based Coding Interview Preparation Platform</span>
            <span className="block text-xs font-bold text-slate-400">Master Coding Interviews with AI-powered learning.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/about" className="hidden rounded-lg px-3 py-2 text-sm font-black text-slate-300 transition hover:bg-slate-800 hover:text-white sm:inline-flex">About</Link>
          <Link to="/contact" className="hidden rounded-lg px-3 py-2 text-sm font-black text-slate-300 transition hover:bg-slate-800 hover:text-white sm:inline-flex">Contact</Link>
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-black text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-800">Sign in</Link>
          <Link to="/signup" className="btn-primary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black transition">
            Start
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>

    <section className="hero-stage">
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-sm font-black text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Practice coding problems with real-time code execution and AI-assisted learning
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI-Based Coding Interview Preparation Platform
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Master Coding Interviews with AI-Powered Learning, Smart Hints, Intelligent Code Reviews, and Personalized Preparation.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary-premium inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-black transition">
              Create free account
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-black transition">
              Open workspace
            </Link>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="hero-card-flat px-4 py-4">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <CodePreview />
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Platform Core</p>
          <h2 className="mt-2 text-3xl font-black text-white lg:text-5xl">Practice problems, get AI hints, and review solutions.</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Practice coding problems with real-time execution, AI-guided hints, intelligent code reviews, and progress tracking.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="premium-card p-6">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-white">AI Coding Assistant</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Ask questions about coding problems, algorithms, data structures, and interview concepts.</p>
        </article>

        <article className="premium-card p-6">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <TerminalSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-white">AI Hint Generator</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Receive intelligent hints that guide your thinking without revealing the complete solution.</p>
        </article>

        <article className="premium-card p-6">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-white">AI Code Reviewer</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Get instant AI-powered feedback on code quality, complexity, optimizations, and interview readiness.</p>
        </article>

      </div>
    </section>
  </main>
);

const CodePreview = () => (
  <div className="code-scene">
    <div className="code-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400"></span>
          <span className="h-3 w-3 rounded-full bg-amber-400"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
        </div>
        <span className="font-mono text-xs font-black text-slate-500">two-sum.js</span>
      </div>

      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="border-b border-slate-700/60 bg-slate-950/60 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center gap-2 text-sm font-black text-cyan-300">
            <Eye className="h-4 w-4" />
            Problem
          </div>
          <h3 className="text-2xl font-black text-white">Two Sum</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Return indices of two numbers that add up to the target.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {['Hash Map', 'Array', 'Easy'].map((tag) => (
              <span key={tag} className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-black text-slate-300">{tag}</span>
            ))}
          </div>

          <div className="mt-7 rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Accepted
            </div>
            <p className="mt-2 text-xs leading-5 text-emerald-100/80">Runtime 42 ms. Memory 44.8 MB.</p>
          </div>
        </aside>

        <div className="bg-[#050912] p-5">
          <div className="font-mono text-sm leading-7 text-slate-300">
            <p><span className="text-fuchsia-300">function</span> <span className="text-cyan-300">twoSum</span>(nums, target) {'{'}</p>
            <p className="pl-5"><span className="text-fuchsia-300">const</span> seen = <span className="text-fuchsia-300">new</span> Map();</p>
            <p className="pl-5"><span className="text-fuchsia-300">for</span> (<span className="text-fuchsia-300">let</span> i = 0; i &lt; nums.length; i++) {'{'}</p>
            <p className="pl-10"><span className="text-fuchsia-300">const</span> need = target - nums[i];</p>
            <p className="pl-10"><span className="text-fuchsia-300">if</span> (seen.has(need)) {'{'}</p>
            <p className="pl-14 text-emerald-300">return [seen.get(need), i];</p>
            <p className="pl-10">{'}'}</p>
            <p className="pl-10">seen.set(nums[i], i);</p>
            <p className="pl-5">{'}'}</p>
            <p>{'}'}</p>
          </div>

          <div className="mt-7 rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-cyan-200">
              <Gauge className="h-4 w-4" />
              Trace
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 7, 11, 15].map((num, index) => (
                <div key={num} className={`rounded-lg border px-3 py-3 text-center font-mono text-sm font-black ${index === 1 ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LandingPage;
