import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { ArrowRight, BarChart3, CheckCircle, Circle, Code2, Eye, FileText, Filter, LogOut, Search, Sparkles, User, Zap } from 'lucide-react';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });
  const [query, setQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
    setTimeout(() => setIsLoaded(true), 100);
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const titleMatch = problem.title?.toLowerCase().includes(query.trim().toLowerCase());
      const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
      const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
      const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
      const statusMatch = filters.status === 'all'
        || (filters.status === 'solved' && isSolved)
        || (filters.status === 'unsolved' && !isSolved);

      return titleMatch && difficultyMatch && tagMatch && statusMatch;
    });
  }, [filters, problems, query, solvedProblems]);

  const stats = {
    solved: solvedProblems.length,
    total: problems.length,
    level: solvedProblems.length < 10 ? 'Starter' : solvedProblems.length < 50 ? 'Builder' : 'Expert',
  };

  return (
    <div className="app-shell min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-slate-700/40 bg-slate-950/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient text-slate-950">
              <Code2 className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-black text-white">AI-Based Coding Interview Preparation Platform</span>
              <span className="block text-xs font-semibold text-slate-400">Interview Prep Workspace</span>
            </span>
          </NavLink>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} role="button" className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 transition hover:border-cyan-400/50">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-bold text-white">{user?.firstname} {user?.lastname}</div>
                <div className="text-xs font-semibold text-emerald-300">Learning</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-base font-black text-cyan-200 ring-1 ring-slate-700">
                {user?.firstname?.[0]?.toUpperCase() || 'U'}
              </div>
            </label>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-64 rounded-lg border border-slate-700 bg-slate-950 p-2 shadow-2xl">
              <li>
                <NavLink to="/profile" className="rounded-md text-slate-200 hover:bg-slate-800">
                  <User className="h-5 w-5 text-cyan-300" />
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/ai-knowledge-base" className="rounded-md text-slate-200 hover:bg-slate-800">
                  <FileText className="h-5 w-5 text-amber-300" />
                  AI Knowledge Base
                </NavLink>
              </li>
              <li>
                <a href="https://dsa38.netlify.app/" target="_blank" rel="noopener noreferrer" className="rounded-md text-slate-200 hover:bg-slate-800">
                  <Eye className="h-5 w-5 text-emerald-300" />
                  DSA Visualization
                </a>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className="rounded-md text-slate-200 hover:bg-slate-800">
                    <BarChart3 className="h-5 w-5 text-amber-300" />
                    Admin Panel
                  </NavLink>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="rounded-md text-red-300 hover:bg-red-500/10">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className={`mx-auto max-w-7xl px-5 py-8 transition duration-700 lg:px-8 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-strong rounded-lg p-6 lg:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Welcome back, {user?.firstname || 'coder'}
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white lg:text-6xl">
              Track progress and prepare confidently for interviews.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Track progress, improve problem-solving skills, and prepare confidently for coding interviews.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => document.getElementById('problem-list')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-black">
                <Zap className="h-5 w-5" />
                Start solving
                <ArrowRight className="h-5 w-5" />
              </button>
              <a href="https://dsa38.netlify.app/" target="_blank" rel="noopener noreferrer" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-bold">
                <Eye className="h-5 w-5" />
                Open visualizer
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard label="Solved" value={`${stats.solved}/${stats.total}`} tone="text-emerald-300" />
            <StatCard label="Level" value={stats.level} tone="text-cyan-300" />
            <StatCard label="Available" value={stats.total} tone="text-amber-300" />
          </div>
        </section>

        <section className="mt-8 surface rounded-lg p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-cyan-300 ring-1 ring-slate-700">
                <Filter className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-white">Problem Filters</h2>
                <p className="text-sm text-slate-400">{filteredProblems.length} problems match your current view</p>
              </div>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search problems" className="field-premium w-full py-2.5 pl-10 pr-3" />
            </label>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <FilterGroup label="Difficulty" value={filters.difficulty} options={['all', 'easy', 'medium', 'hard']} onChange={(difficulty) => setFilters({ ...filters, difficulty })} />
            <FilterGroup label="Topic" value={filters.tag} options={['all', 'array', 'linkedList', 'graph', 'dp']} onChange={(tag) => setFilters({ ...filters, tag })} />
            <FilterGroup label="Status" value={filters.status} options={['all', 'solved', 'unsolved']} onChange={(status) => setFilters({ ...filters, status })} />
          </div>
        </section>

        <section id="problem-list" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProblems.map((problem) => {
            const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
            return (
              <NavLink key={problem._id} to={`/problem/${problem._id}`} className="premium-card group relative min-h-44 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="pr-2 text-lg font-black leading-snug text-white group-hover:text-cyan-200">{problem.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${getDifficultyStyle(problem.difficulty)}`}>
                        {capitalize(problem.difficulty)}
                      </span>
                      <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-black text-cyan-200">
                        {formatTag(problem.tags)}
                      </span>
                    </div>
                  </div>
                  {isSolved ? <CheckCircle className="h-6 w-6 shrink-0 text-emerald-300" /> : <Circle className="h-6 w-6 shrink-0 text-slate-600" />}
                </div>
                <div className="absolute bottom-5 left-5 flex items-center gap-2 text-sm font-black text-slate-400 transition group-hover:text-cyan-200">
                  Solve problem
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </NavLink>
            );
          })}
        </section>

        {filteredProblems.length === 0 && (
          <div className="mt-8 surface rounded-lg p-10 text-center">
            <h3 className="text-2xl font-black text-white">No problems found</h3>
            <p className="mt-2 text-slate-400">Try changing your filters or search text.</p>
            <button onClick={() => { setFilters({ difficulty: 'all', tag: 'all', status: 'all' }); setQuery(''); }} className="btn-secondary-premium mt-5 rounded-lg px-5 py-3 font-bold">
              Reset filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const StatCard = ({ label, value, tone }) => (
  <div className="premium-card p-5">
    <div className={`text-3xl font-black ${tone}`}>{value}</div>
    <div className="mt-1 text-sm font-bold text-slate-400">{label}</div>
  </div>
);

const FilterGroup = ({ label, options, value, onChange }) => (
  <div>
    <div className="mb-2 text-xs font-black uppercase text-slate-500">{label}</div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button key={option} onClick={() => onChange(option)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${value === option ? 'bg-cyan-300 text-slate-950' : 'bg-slate-900 text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800'}`}>
          {option === 'linkedList' ? 'Linked List' : option === 'dp' ? 'DP' : capitalize(option)}
        </button>
      ))}
    </div>
  </div>
);

const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);

const formatTag = (tag = '') => tag === 'linkedList' ? 'Linked List' : tag === 'dp' ? 'DP' : capitalize(tag);

const getDifficultyStyle = (difficulty = '') => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
    case 'medium':
      return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
    case 'hard':
      return 'border-red-400/30 bg-red-400/10 text-red-300';
    default:
      return 'border-slate-600 bg-slate-800 text-slate-300';
  }
};

export default Homepage;
