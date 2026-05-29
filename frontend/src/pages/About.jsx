import { Link } from 'react-router';
import { ArrowLeft, Bot, CheckCircle, Code2, Eye, Layers, Sparkles, TrendingUp, Zap } from 'lucide-react';

const features = [
  [Eye, 'Algorithm Visualization', 'Step-by-step visual understanding for sorting, searching, graphs, and patterns.'],
  [Zap, 'Real Coding Problems', 'Practice real coding problems with fast feedback and clear problem statements.'],
  [CheckCircle, 'Real Test Execution', 'Validate code with visible and hidden tests in an authentic workflow.'],
  [Layers, 'Focused Workspace', 'Use Monaco Editor, tabbed panels, results, submissions, and hints without visual clutter.'],
  [TrendingUp, 'Progress Tracking', 'Track progress, solved counts, and submission history to measure improvement.'],
  [Bot, 'AI Help', 'Ask questions about coding problems, algorithms, data structures, and interview concepts.'],
];

const About = () => (
  <main className="app-shell min-h-screen">
    <Header />
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
          <Sparkles className="h-4 w-4" />
          About AI-Based Coding Interview Preparation Platform
        </div>
        <h1 className="text-5xl font-black leading-tight text-white lg:text-7xl">Master coding interviews with AI-driven feedback.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          AI-Based Coding Interview Preparation Platform helps developers prepare for technical interviews through AI-powered hints, code reviews, real test execution, and progress tracking.
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
        <span className="text-lg font-black text-white">AI-Based Coding Interview Preparation Platform</span>
      </Link>
      <Link to="/" className="btn-secondary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold">
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>
    </div>
  </nav>
);

export default About;
