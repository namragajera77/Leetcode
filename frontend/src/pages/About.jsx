import { Link } from 'react-router';
import { ArrowLeft, Bot, CheckCircle, Code2, Eye, Layers, Sparkles, TrendingUp, Zap } from 'lucide-react';

const features = [
  [Eye, 'Algorithm Visualization', 'Step-by-step visual understanding for sorting, searching, graphs, and patterns.'],
  [Zap, 'LeetCode-Style Problems', 'Practice real coding challenges with fast feedback and clean problem statements.'],
  [CheckCircle, 'Real Test Execution', 'Validate code with visible and hidden tests in an authentic workflow.'],
  [Layers, 'Focused Workspace', 'Use Monaco Editor, tabbed panels, results, submissions, and hints without visual clutter.'],
  [TrendingUp, 'Progress Tracking', 'Watch solved counts, difficulty mix, and submission history evolve over time.'],
  [Bot, 'AI Help', 'Ask for hints, complexity analysis, and debugging guidance when you get stuck.'],
];

const About = () => (
  <main className="app-shell min-h-screen">
    <Header />
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
          <Sparkles className="h-4 w-4" />
          About NG AlgoVista
        </div>
        <h1 className="text-5xl font-black leading-tight text-white lg:text-7xl">A learning platform for people who want the logic to click.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          NG AlgoVista helps developers understand algorithms through visual learning, focused coding practice, and AI-guided support.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <article className="surface-strong rounded-lg p-7">
          <h2 className="text-2xl font-black text-white">Learning-first approach</h2>
          <p className="mt-4 leading-7 text-slate-400">
            The platform is designed around understanding, not memorization. Every problem becomes a way to learn a reusable pattern.
          </p>
        </article>
        <article className="surface-strong rounded-lg p-7">
          <h2 className="text-2xl font-black text-white">Practice with feedback</h2>
          <p className="mt-4 leading-7 text-slate-400">
            Write code, run visible tests, submit final solutions, and review submissions in a polished coding workspace.
          </p>
        </article>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, title, description]) => (
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

const Header = () => (
  <nav className="border-b border-slate-700/40 bg-slate-950/70 backdrop-blur-2xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient text-slate-950">
          <Code2 className="h-6 w-6" />
        </span>
        <span className="text-lg font-black text-white">NG AlgoVista</span>
      </Link>
      <Link to="/" className="btn-secondary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold">
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>
    </div>
  </nav>
);

export default About;
