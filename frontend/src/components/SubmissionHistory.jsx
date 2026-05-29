import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Code2, X } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const formatMemory = (memory) => {
    if (!memory && memory !== 0) return '-';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-300"></span>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-lg border border-red-400/25 bg-red-400/10 p-4 text-sm font-bold text-red-200">{error}</div>;
  }

  return (
    <div>
      {submissions.length === 0 ? (
        <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
          No submissions found for this problem.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-slate-700/50">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Runtime</th>
                  <th className="px-4 py-3">Memory</th>
                  <th className="px-4 py-3">Tests</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="text-slate-300 hover:bg-slate-900/80">
                    <td className="px-4 py-3 font-bold">{index + 1}</td>
                    <td className="px-4 py-3 font-mono text-cyan-200">{sub.language}</td>
                    <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                    <td className="px-4 py-3 font-mono">{sub.runtime} sec</td>
                    <td className="px-4 py-3 font-mono">{formatMemory(sub.memory)}</td>
                    <td className="px-4 py-3 font-mono">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(sub.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button className="btn-secondary-premium inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black" onClick={() => setSelectedSubmission(sub)}>
                        <Code2 className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-500">Showing {submissions.length} submissions</p>
        </>
      )}

      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl rounded-lg">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Submission Details</h3>
                <p className="mt-1 text-sm text-slate-400">{selectedSubmission.language}</p>
              </div>
              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => setSelectedSubmission(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge status={selectedSubmission.status} />
              <span className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-bold text-slate-300">Runtime: {selectedSubmission.runtime}s</span>
              <span className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-bold text-slate-300">Memory: {formatMemory(selectedSubmission.memory)}</span>
              <span className="rounded-md border border-slate-700 px-2.5 py-1 text-xs font-bold text-slate-300">Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</span>
            </div>
            {selectedSubmission.errorMessage && (
              <div className="mb-4 rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200">{selectedSubmission.errorMessage}</div>
            )}
            <pre className="max-h-[60vh] overflow-auto rounded-lg border border-slate-700 bg-[#060a12] p-4 text-sm leading-6 text-slate-100"><code>{selectedSubmission.code}</code></pre>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status = '' }) => {
  const tone = status === 'accepted'
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
    : status === 'wrong'
      ? 'border-red-400/30 bg-red-400/10 text-red-300'
      : 'border-amber-400/30 bg-amber-400/10 text-amber-300';

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-black capitalize ${tone}`}>{status || 'unknown'}</span>;
};

export default SubmissionHistory;
