import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, Filter, Search, Trash2 } from 'lucide-react';
import { NavLink } from 'react-router';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(`Failed to fetch problems: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" permanently? This cannot be undone.`)) return;
    try {
      setDeleteLoading(id);
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems((prev) => prev.filter((problem) => problem._id !== id));
      setSuccessMessage(`Problem "${title}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      || problem.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all'
      || problem.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  }), [filterDifficulty, problems, searchTerm]);

  if (loading) return <LoadingState label="Loading problems..." />;
  if (error) return <ErrorState error={error} />;

  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <AdminHeader
          icon={Trash2}
          eyebrow="Destructive action"
          title="Delete Problems"
          description="Review and remove problems carefully. Deleted problems cannot be recovered."
        />

        {successMessage && <Notice type="success" icon={CheckCircle}>{successMessage}</Notice>}

        <Stats problems={problems} />
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
        />

        <ProblemTable
          problems={filteredProblems}
          actionLabel="Delete"
          actionIcon={Trash2}
          actionTone="danger"
          busyId={deleteLoading}
          onAction={(problem) => handleDelete(problem._id, problem.title)}
        />

        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          Showing {filteredProblems.length} of {problems.length} problems
        </p>
      </div>
    </main>
  );
};

const AdminHeader = ({ icon: Icon, eyebrow, title, description }) => (
  <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-sm font-bold text-red-200">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <h1 className="text-4xl font-black text-white lg:text-6xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{description}</p>
    </div>
    <NavLink to="/admin" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
      <ArrowLeft className="h-4 w-4" />
      Admin Panel
    </NavLink>
  </div>
);

const Stats = ({ problems }) => (
  <section className="mb-6 grid gap-4 md:grid-cols-3">
    <Metric icon={FileText} label="Total Problems" value={problems.length} tone="cyan" />
    <Metric icon={CheckCircle} label="Easy Problems" value={problems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length} tone="emerald" />
    <Metric icon={AlertTriangle} label="Hard Problems" value={problems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length} tone="red" />
  </section>
);

const FilterBar = ({ searchTerm, setSearchTerm, filterDifficulty, setFilterDifficulty }) => (
  <section className="surface mb-6 rounded-lg p-5">
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title or tag" className="field-premium w-full py-3 pl-10 pr-3" />
      </label>
      <label className="relative">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="field-premium w-full py-3 pl-10 pr-3">
          <option className="bg-slate-950" value="all">All Difficulties</option>
          <option className="bg-slate-950" value="easy">Easy</option>
          <option className="bg-slate-950" value="medium">Medium</option>
          <option className="bg-slate-950" value="hard">Hard</option>
        </select>
      </label>
    </div>
  </section>
);

const ProblemTable = ({ problems, actionLabel, actionIcon: ActionIcon, actionTone, busyId, onAction }) => (
  <div className="overflow-hidden rounded-lg border border-slate-700/50">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Problem</th>
            <th className="px-4 py-3">Difficulty</th>
            <th className="px-4 py-3">Tag</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/70">
          {problems.length === 0 ? (
            <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-400">No problems found.</td></tr>
          ) : problems.map((problem, index) => (
            <tr key={problem._id} className="text-slate-300 hover:bg-slate-900">
              <td className="px-4 py-4 font-mono text-slate-500">{index + 1}</td>
              <td className="px-4 py-4">
                <div className="font-black text-white">{problem.title}</div>
                <div className="mt-1 max-w-xl truncate text-xs text-slate-500">{problem.description}</div>
              </td>
              <td className="px-4 py-4"><DifficultyBadge value={problem.difficulty} /></td>
              <td className="px-4 py-4"><TagBadge value={problem.tags} /></td>
              <td className="px-4 py-4">
                <button disabled={busyId === problem._id} onClick={() => onAction(problem)} className={`${actionTone === 'danger' ? 'border-red-400/25 bg-red-400/10 text-red-300 hover:bg-red-400/15' : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/15'} inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black transition disabled:opacity-50`}>
                  <ActionIcon className="h-4 w-4" />
                  {busyId === problem._id ? 'Working...' : actionLabel}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Metric = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    red: 'border-red-400/20 bg-red-400/10 text-red-300',
  };
  return (
    <div className="premium-card p-5">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg border ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-black uppercase text-slate-500">{label}</div>
    </div>
  );
};

const Notice = ({ children, type, icon: Icon }) => (
  <div className={`mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm font-bold ${type === 'success' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-red-400/25 bg-red-400/10 text-red-200'}`}>
    <Icon className="h-5 w-5" />
    {children}
  </div>
);

const DifficultyBadge = ({ value = '' }) => {
  const tone = value?.toLowerCase() === 'easy'
    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
    : value?.toLowerCase() === 'medium'
      ? 'border-amber-400/25 bg-amber-400/10 text-amber-300'
      : 'border-red-400/25 bg-red-400/10 text-red-300';
  return <span className={`rounded-md border px-2.5 py-1 text-xs font-black capitalize ${tone}`}>{value}</span>;
};

const TagBadge = ({ value = '' }) => <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-black text-cyan-200">{value}</span>;

const LoadingState = ({ label }) => (
  <div className="app-shell flex min-h-screen items-center justify-center">
    <div className="text-center">
      <span className="loading loading-spinner loading-lg text-cyan-300"></span>
      <p className="mt-4 font-bold text-slate-300">{label}</p>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="app-shell flex min-h-screen items-center justify-center px-5">
    <div className="max-w-md rounded-lg border border-red-400/25 bg-red-400/10 p-5 text-red-200">
      <div className="flex gap-3">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <div>
          <h3 className="font-black">Error</h3>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDelete;
