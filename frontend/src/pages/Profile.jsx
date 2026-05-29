import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { ArrowLeft, Award, Calendar, CheckCircle, Mail, Target, TrendingUp, Trophy, Zap } from 'lucide-react';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solvedRes, submissionsRes] = await Promise.all([
          axiosClient.get('/problem/problemSolvedByUser'),
          axiosClient.get('/submission/userSubmission'),
        ]);
        setSolvedProblems(solvedRes.data);
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (user) fetchData();
    setTimeout(() => setIsLoaded(true), 100);
  }, [user]);

  const stats = {
    totalSolved: solvedProblems.length,
    easyCount: solvedProblems.filter((p) => p.difficulty === 'easy').length,
    mediumCount: solvedProblems.filter((p) => p.difficulty === 'medium').length,
    hardCount: solvedProblems.filter((p) => p.difficulty === 'hard').length,
    totalSubmissions: submissions.length,
    acceptedSubmissions: submissions.filter((s) => s.status === 'accepted').length,
  };

  const initials = `${user?.firstname?.[0]?.toUpperCase() || 'U'}${user?.lastname?.[0]?.toUpperCase() || ''}`;
  const acceptance = stats.totalSubmissions > 0 ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100) : 0;

  return (
    <main className="app-shell min-h-screen">
      <div className={`mx-auto max-w-7xl px-5 py-8 transition duration-700 lg:px-8 lg:py-12 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        <NavLink to="/" className="btn-secondary-premium mb-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold">
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </NavLink>

        <section className="surface-strong rounded-lg p-6 lg:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-lg accent-gradient text-5xl font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              {initials}
              <span className="absolute -bottom-3 -right-3 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 ring-4 ring-slate-950">
                <Trophy className="h-6 w-6" />
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-black text-white lg:text-6xl">{user?.firstname} {user?.lastname}</h1>
              <div className="mt-4 flex flex-col gap-3 text-slate-400 sm:flex-row sm:flex-wrap">
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-300" />{user?.email || user?.emailid}</span>
                <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-cyan-300" />Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black capitalize text-cyan-200">
                <Award className="h-4 w-4" />
                {user?.role || 'Student'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-64">
              <MiniStat value={stats.totalSolved} label="Solved" />
              <MiniStat value={`${acceptance}%`} label="Accepted" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Target} label="Easy Problems" value={stats.easyCount} tone="emerald" />
          <StatCard icon={TrendingUp} label="Medium Problems" value={stats.mediumCount} tone="amber" />
          <StatCard icon={Zap} label="Hard Problems" value={stats.hardCount} tone="red" />
          <StatCard icon={CheckCircle} label="Accepted Submissions" value={`${stats.acceptedSubmissions}/${stats.totalSubmissions}`} tone="cyan" />
        </section>
      </div>
    </main>
  );
}

const toneMap = {
  emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  red: 'border-red-400/20 bg-red-400/10 text-red-300',
  cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
};

const MiniStat = ({ value, label }) => (
  <div className="premium-card p-5 text-center">
    <div className="text-3xl font-black text-white">{value}</div>
    <div className="mt-1 text-xs font-black uppercase text-slate-500">{label}</div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <article className="premium-card p-6">
    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border ${toneMap[tone]}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="text-3xl font-black text-white">{value}</div>
    <h3 className="mt-2 font-black text-slate-200">{label}</h3>
  </article>
);

export default Profile;
