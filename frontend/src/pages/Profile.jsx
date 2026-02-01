import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { User, Mail, Calendar, Trophy, Target, TrendingUp, CheckCircle, Clock, ArrowLeft, Code2, Award, Zap } from 'lucide-react';

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
          axiosClient.get('/submission/userSubmission')
        ]);
        console.log('Solved problems:', solvedRes.data);
        console.log('Submissions:', submissionsRes.data);
        setSolvedProblems(solvedRes.data);
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        console.error('Error details:', error.response?.data);
      }
    };

    if (user) {
      fetchData();
    }
    
    setTimeout(() => setIsLoaded(true), 100);
  }, [user]);

  const stats = {
    totalSolved: solvedProblems.length,
    easyCount: solvedProblems.filter(p => p.difficulty === 'easy').length,
    mediumCount: solvedProblems.filter(p => p.difficulty === 'medium').length,
    hardCount: solvedProblems.filter(p => p.difficulty === 'hard').length,
    totalSubmissions: submissions.length,
    acceptedSubmissions: submissions.filter(s => s.status === 'accepted').length,
    streak: 0, // Can calculate from submission dates
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-400/40';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/40';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-400/40';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/40';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
      
      {/* Content */}
      <div className={`relative z-10 container mx-auto px-6 lg:px-8 py-8 lg:py-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Back Button */}
        <NavLink 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 text-white transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </NavLink>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl ring-4 ring-white/20">
                <span className="text-5xl font-bold text-white">{user?.firstname?.[0]?.toUpperCase()}{user?.lastname?.[0]?.toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {user?.firstname} {user?.lastname}
                </span>
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-purple-200">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm lg:text-base">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm lg:text-base">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/40">
                <Award className="h-4 w-4 text-purple-300" />
                <span className="text-purple-200 font-semibold capitalize">{user?.role || 'Student'}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                  {stats.totalSolved}
                </div>
                <div className="text-xs text-purple-300 font-medium">Solved</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  {stats.streak}
                </div>
                <div className="text-xs text-purple-300 font-medium">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Easy Problems */}
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl rounded-2xl shadow-xl border border-green-400/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-green-400">{stats.easyCount}</span>
            </div>
            <h3 className="text-green-200 font-semibold mb-1">Easy Problems</h3>
            <p className="text-xs text-green-300/60">Foundation Building</p>
          </div>

          {/* Medium Problems */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur-xl rounded-2xl shadow-xl border border-yellow-400/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <span className="text-3xl font-bold text-yellow-400">{stats.mediumCount}</span>
            </div>
            <h3 className="text-yellow-200 font-semibold mb-1">Medium Problems</h3>
            <p className="text-xs text-yellow-300/60">Skill Development</p>
          </div>

          {/* Hard Problems */}
          <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl shadow-xl border border-red-400/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Zap className="h-6 w-6 text-red-400" />
              </div>
              <span className="text-3xl font-bold text-red-400">{stats.hardCount}</span>
            </div>
            <h3 className="text-red-200 font-semibold mb-1">Hard Problems</h3>
            <p className="text-xs text-red-300/60">Expert Mastery</p>
          </div>

          {/* Acceptance Rate */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-400/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-purple-400">
                {stats.totalSubmissions > 0 ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-purple-200 font-semibold mb-1">Acceptance Rate</h3>
            <p className="text-xs text-purple-300/60">{stats.acceptedSubmissions}/{stats.totalSubmissions} Accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
