import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, Eye, Filter, RefreshCw, Search, Trash2, Upload, Video, VideoOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterVideoStatus, setFilterVideoStatus] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshLoading(true) : setLoading(true);
      setError(null);
      if (!user || user.role !== 'admin') {
        setError('Access denied: Admin privileges required');
        return;
      }

      let data;
      try {
        data = (await axiosClient.get('/problem/getAllProblemWithVideos')).data;
      } catch {
        data = (await axiosClient.get('/problem/getAllProblem')).data;
      }
      setProblems(data || []);
      if (isRefresh) {
        setSuccessMessage('Video data refreshed successfully.');
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err.response?.data?.error || err.response?.data || err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const handleDeleteVideo = async (problemId, problemTitle) => {
    if (!window.confirm(`Delete the solution video for "${problemTitle}"? This cannot be undone.`)) return;
    try {
      setDeleteLoading(problemId);
      setError(null);
      setSuccessMessage(null);
      await axiosClient.delete(`/video/delete/${problemId}`);
      setProblems((prev) => prev.map((problem) => problem._id === problemId ? { ...problem, hasVideo: false, videoInfo: null } : problem));
      setSuccessMessage(`Video for "${problemTitle}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Delete video error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete video.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      || problem.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    const matchesVideoStatus = filterVideoStatus === 'all'
      || (filterVideoStatus === 'hasVideo' && problem.hasVideo)
      || (filterVideoStatus === 'noVideo' && !problem.hasVideo);
    return matchesSearch && matchesDifficulty && matchesVideoStatus;
  }), [filterDifficulty, filterVideoStatus, problems, searchTerm]);

  if (loading) return <LoadingState label="Loading videos..." />;

  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
              <Video className="h-4 w-4" />
              Editorial media
            </div>
            <h1 className="text-4xl font-black text-white lg:text-6xl">Video Management</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Upload, review, and remove solution videos for every coding problem.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => fetchProblems(true)} disabled={refreshLoading} className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
              <RefreshCw className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
              {refreshLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <NavLink to="/admin" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
              <ArrowLeft className="h-4 w-4" />
              Admin Panel
            </NavLink>
          </div>
        </div>

        {successMessage && <Notice type="success" icon={CheckCircle}>{successMessage}</Notice>}
        {error && <Notice type="error" icon={AlertTriangle}>{error}</Notice>}

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <Metric icon={Video} label="Total Problems" value={problems.length} tone="cyan" />
          <Metric icon={CheckCircle} label="With Videos" value={problems.filter((p) => p.hasVideo).length} tone="emerald" />
          <Metric icon={VideoOff} label="Without Videos" value={problems.filter((p) => !p.hasVideo).length} tone="amber" />
          <Metric icon={Clock} label="Filtered" value={filteredProblems.length} tone="slate" />
        </section>

        <section className="surface mb-6 rounded-lg p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search problems" className="field-premium w-full py-3 pl-10 pr-3" />
            </label>
            <SelectFilter icon={Filter} value={filterDifficulty} onChange={setFilterDifficulty} options={[['all', 'All Difficulties'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']]} />
            <SelectFilter icon={Video} value={filterVideoStatus} onChange={setFilterVideoStatus} options={[['all', 'All Videos'], ['hasVideo', 'With Video'], ['noVideo', 'Without Video']]} />
          </div>
        </section>

        <div className="overflow-hidden rounded-lg border border-slate-700/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Video Status</th>
                  <th className="px-4 py-3">Video Info</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                {filteredProblems.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-400">No problems found.</td></tr>
                ) : filteredProblems.map((problem, index) => (
                  <tr key={problem._id} className="text-slate-300 hover:bg-slate-900">
                    <td className="px-4 py-4 font-mono text-slate-500">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="font-black text-white">{problem.title}</div>
                      <div className="mt-1 max-w-xl truncate text-xs text-slate-500">{problem.description}</div>
                      <TagBadge value={problem.tags} />
                    </td>
                    <td className="px-4 py-4"><DifficultyBadge value={problem.difficulty} /></td>
                    <td className="px-4 py-4">
                      {problem.hasVideo
                        ? <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300"><Video className="h-4 w-4" />Has Video</span>
                        : <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-300"><VideoOff className="h-4 w-4" />No Video</span>}
                    </td>
                    <td className="px-4 py-4">
                      {problem.hasVideo && problem.videoInfo ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-300"><Clock className="h-3 w-3" />{formatDuration(problem.videoInfo.duration)}</div>
                          <div className="text-xs text-slate-500">{formatDate(problem.videoInfo.uploadedAt)}</div>
                          <a href={problem.videoInfo.secureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-xs font-black text-cyan-300">
                            <Eye className="h-3 w-3" />
                            View
                          </a>
                        </div>
                      ) : <span className="text-xs text-slate-500">No video info</span>}
                    </td>
                    <td className="px-4 py-4">
                      {problem.hasVideo ? (
                        <button onClick={() => handleDeleteVideo(problem._id, problem.title)} disabled={deleteLoading === problem._id} className="inline-flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-400/15 disabled:opacity-50">
                          <Trash2 className="h-4 w-4" />
                          {deleteLoading === problem._id ? 'Deleting...' : 'Delete Video'}
                        </button>
                      ) : (
                        <NavLink to={`/admin/upload/${problem._id}`} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300 transition hover:bg-emerald-400/15">
                          <Upload className="h-4 w-4" />
                          Upload
                        </NavLink>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          Showing {filteredProblems.length} of {problems.length} problems. {problems.filter((p) => p.hasVideo).length} with videos, {problems.filter((p) => !p.hasVideo).length} without videos.
        </p>
      </div>
    </main>
  );
};

const SelectFilter = ({ icon: Icon, value, onChange, options }) => (
  <label className="relative">
    <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    <select value={value} onChange={(e) => onChange(e.target.value)} className="field-premium w-full py-3 pl-10 pr-3">
      {options.map(([optionValue, label]) => <option key={optionValue} className="bg-slate-950" value={optionValue}>{label}</option>)}
    </select>
  </label>
);

const Metric = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    slate: 'border-slate-600 bg-slate-800 text-slate-300',
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

const TagBadge = ({ value = '' }) => <div className="mt-2 inline-flex rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-black text-cyan-200">{value}</div>;

const LoadingState = ({ label }) => (
  <div className="app-shell flex min-h-screen items-center justify-center">
    <div className="text-center">
      <span className="loading loading-spinner loading-lg text-cyan-300"></span>
      <p className="mt-4 font-bold text-slate-300">{label}</p>
    </div>
  </div>
);

const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default AdminVideo;
