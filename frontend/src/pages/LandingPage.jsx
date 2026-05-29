import { Link } from 'react-router';
import { ArrowRight, BookOpen, Braces, Code2, Eye, Gauge, Sparkles, TerminalSquare, Zap } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Visual algorithm learning',
    description: 'Turn abstract data movement into clear steps, states, and patterns you can actually remember.',
  },
  {
    icon: TerminalSquare,
    title: 'Real coding workspace',
    description: 'Practice in a focused LeetCode-style editor with instant runs, submissions, and feedback.',
  },
  {
    icon: Sparkles,
    title: 'AI-guided debugging',
    description: 'Ask targeted questions when stuck and learn the reasoning behind each solution path.',
  },
];

const stats = [
  ['3', 'Languages'],
  ['24/7', 'Practice'],
  ['AI', 'Mentor'],
];

const LandingPage = () => (
  <main className="app-shell text-slate-100">
    <nav className="sticky top-0 z-40 border-b border-slate-700/40 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient text-slate-950 shadow-lg shadow-cyan-500/15">
            <Code2 className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-lg font-black leading-tight tracking-tight text-white">NG AlgoVista</span>
            <span className="block text-xs font-medium text-slate-400">Visualize. Solve. Master.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/about" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white sm:inline-flex">
            About
          </Link>
          <Link to="/contact" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white sm:inline-flex">
            Contact
          </Link>
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-bold text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-800">
            Sign in
          </Link>
          <Link to="/signup" className="btn-primary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black transition">
            Start
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>

    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-14 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20 lg:pt-16">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
          <Zap className="h-4 w-4" />
          Built for serious DSA practice
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Code like the logic is visible.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          NG AlgoVista blends algorithm visualization, real problem solving, and AI support into one calm, high-performance learning workspace.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/signup" className="btn-primary-premium inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-black transition">
            Create free account
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/login" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-bold transition">
            Open workspace
          </Link>
        </div>

        <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
          {stats.map(([value, label]) => (
            <div key={label} className="premium-card px-4 py-4">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="mt-1 text-xs font-semibold uppercase text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="surface-strong overflow-hidden rounded-lg">
          <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-amber-400"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-xs font-bold text-slate-400">two-sum.js</span>
          </div>
          <div className="grid min-h-[420px] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-slate-700/60 bg-slate-950/55 p-5 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-cyan-300">
                <BookOpen className="h-4 w-4" />
                Problem
              </div>
              <h2 className="text-xl font-black text-white">Two Sum</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Return indices of two numbers that add up to target.
              </p>
              <div className="mt-6 space-y-3">
                {['Hash Map', 'Array', 'Easy'].map((item) => (
                  <span key={item} className="mr-2 inline-flex rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-300">
                  <Gauge className="h-4 w-4" />
                  Accepted
                </div>
                <p className="mt-2 text-xs leading-5 text-emerald-100/80">Runtime 42 ms. Memory 44.8 MB.</p>
              </div>
            </div>
            <div className="bg-[#070b12] p-5 font-mono text-sm leading-7 text-slate-300">
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
              <div className="mt-8 rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4 font-sans">
                <div className="flex items-center gap-2 text-sm font-black text-cyan-200">
                  <Braces className="h-4 w-4" />
                  Trace
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  {[2, 7, 11, 15].map((num, index) => (
                    <div key={num} className={`rounded-md border px-3 py-3 ${index === 1 ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <article key={title} className="premium-card p-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-cyan-300 ring-1 ring-cyan-400/20">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default LandingPage;
