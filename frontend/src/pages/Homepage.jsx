import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { Code2, Eye, Zap, TrendingUp, Filter, CheckCircle, Circle, ArrowRight, User, LogOut, BarChart3, Sparkles } from 'lucide-react';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
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
    
    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 100);
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch = filters.status === 'all' || 
                        (filters.status === 'solved' && isSolved) ||
                        (filters.status === 'unsolved' && !isSolved);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const stats = {
    solved: solvedProblems.length,
    total: problems.length,
    streak: 0, // Can be calculated from submission history
    level: solvedProblems.length < 10 ? 'Beginner' : solvedProblems.length < 50 ? 'Intermediate' : 'Advanced'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Ambient background effects - pointer-events-none to prevent blocking clicks */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
      
      {/* Navigation Bar */}
      <nav className="relative z-50 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="container mx-auto px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    NG AlgoVista
                  </span>
                  <p className="text-xs text-purple-300/90 font-medium tracking-wider mt-0.5">
                    Visualize • Solve • Master
                  </p>
                </div>
              </div>
            </div>

            {/* Right: User Menu */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} role="button" className="btn btn-ghost flex items-center gap-4 cursor-pointer hover:bg-white/10 px-4 py-2.5 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/20 normal-case h-auto min-h-0">
                <div className="flex flex-col items-end">
                  <span className="font-bold text-white text-sm lg:text-base">
                    {user?.firstname} {user?.lastname}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-200 border border-green-400/40 font-semibold">
                    Learning
                  </span>
                </div>
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-xl ring-2 ring-white/20 hover:ring-white/40 transition-all hover:scale-110">
                    <span className="text-lg font-bold text-white flex items-center justify-center w-full h-full">{user?.firstname?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                </div>
              </label>
              <ul tabIndex={0} className="menu dropdown-content bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl w-64 border border-white/20 z-50 mt-3 p-2 shadow-2xl">
                <li onClick={(e) => e.stopPropagation()}>
                  <NavLink to="/profile" className="text-white hover:bg-white/20 active:bg-white/30 rounded-xl">
                    <User className="h-5 w-5 text-purple-300" />
                    <span className="font-medium">Profile</span>
                  </NavLink>
                </li>
                <li onClick={(e) => e.stopPropagation()}>
                  <a 
                    href="https://dsa38.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:bg-white/20 active:bg-white/30 rounded-xl"
                  >
                    <Eye className="h-5 w-5 text-blue-300" />
                    <span className="font-medium">DSA Visualization</span>
                  </a>
                </li>
                {user?.role === 'admin' && (
                  <li onClick={(e) => e.stopPropagation()}>
                    <NavLink 
                      to="/admin" 
                      className="text-white hover:bg-white/20 active:bg-white/30 rounded-xl"
                    >
                      <BarChart3 className="h-5 w-5 text-yellow-300" />
                      <span className="font-medium">Admin Panel</span>
                    </NavLink>
                  </li>
                )}
                <li className="menu-title">
                  <span className="opacity-20 my-1"></span>
                </li>
                <li onClick={(e) => e.stopPropagation()}>
                  <a 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="text-red-300 hover:bg-red-500/20 active:bg-red-500/30 rounded-xl cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`relative z-10 container mx-auto px-6 lg:px-8 py-8 lg:py-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-400/30">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">Welcome back, {user?.firstname}!</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              Learn Algorithms by
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              Seeing Them Work
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-purple-100/80 max-w-3xl mx-auto mb-8 leading-relaxed">
            NG AlgoVista combines <span className="font-semibold text-white">real coding problems</span> with 
            <span className="font-semibold text-white"> algorithm visualization</span> to help you build 
            deep understanding and confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button 
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Start Solving
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="https://dsa38.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl border-2 border-white/40 hover:border-white/70 hover:bg-white/10 backdrop-blur-md text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Open Visualizer
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                {stats.solved}/{stats.total}
              </div>
              <div className="text-sm text-purple-200/80">Problems Solved</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-orange-400/50 transition-all duration-300">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
                {stats.streak}
              </div>
              <div className="text-sm text-purple-200/80">Day Streak</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {stats.level}
              </div>
              <div className="text-sm text-purple-200/80">Current Level</div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
              <Filter className="h-5 w-5 text-purple-300" />
            </div>
            <h2 className="text-xl font-bold text-white">Filter Problems</h2>
          </div>
          
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* Difficulty Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-purple-200 font-semibold min-w-[80px] text-right">Difficulty:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {['all', 'easy', 'medium', 'hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setFilters({...filters, difficulty: diff})}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      filters.difficulty === diff
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/20 hover:border-white/40'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-purple-200 font-semibold min-w-[80px] text-right">Tags:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {['all', 'array', 'linkedList', 'graph', 'dp'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilters({...filters, tag})}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      filters.tag === tag
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/20 hover:border-white/40'
                    }`}
                  >
                    {tag === 'all' ? 'All' : tag === 'linkedList' ? 'Linked List' : tag === 'dp' ? 'DP' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-purple-200 font-semibold min-w-[80px] text-right">Status:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {['all', 'solved', 'unsolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilters({...filters, status})}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      filters.status === status
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-105'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/20 hover:border-white/40'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredProblems.map((problem, index) => {
            const isSolved = solvedProblems.some(sp => sp._id === problem._id);
            return (
              <NavLink 
                key={problem._id} 
                to={`/problem/${problem._id}`}
                className="group block"
                style={{animationDelay: `${index * 50}ms`}}
              >
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/60 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30 h-full min-h-[180px]">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {isSolved ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 rounded-full shadow-lg">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-xs font-bold text-green-100">Solved</span>
                      </div>
                    ) : (
                      <Circle className="h-6 w-6 text-purple-400/40 group-hover:text-purple-300/60 transition-colors" />
                    )}
                  </div>

                  {/* Problem Title */}
                  <h3 className="text-xl font-bold text-white mb-4 pr-24 leading-snug group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-pink-200 group-hover:bg-clip-text transition-all duration-300">
                    {problem.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getDifficultyStyle(problem.difficulty)} shadow-sm`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 border border-blue-400/40 shadow-sm">
                      {problem.tags === 'linkedList' ? 'Linked List' : problem.tags === 'dp' ? 'DP' : problem.tags.charAt(0).toUpperCase() + problem.tags.slice(1)}
                    </span>
                  </div>

                  {/* Hover Action */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 text-purple-300 group-hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-bold">Solve Now</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Empty State / Motivational Card */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-10 border border-purple-400/30">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-4">No Problems Found</h3>
              <p className="text-purple-100/80 mb-6">Try adjusting your filters to see more problems.</p>
              <button 
                onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Motivational Card (shown when there are problems) */}
        {problems.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 text-center">
            <TrendingUp className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Consistency Beats Intensity</h3>
            <p className="text-purple-100/80 text-lg">Solve one problem today. Build the habit that leads to mastery.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-6 text-center border-t border-white/10 bg-white/5 backdrop-blur-md">
        <p className="text-purple-300/70 text-sm italic">
          NG AlgoVista — Learn algorithms with clarity, not memorization.
        </p>
      </footer>
    </div>
  );
}

const getDifficultyStyle = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': 
      return 'bg-green-500/20 text-green-300 border border-green-400/40';
    case 'medium': 
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40';
    case 'hard': 
      return 'bg-red-500/20 text-red-300 border border-red-400/40';
    default: 
      return 'bg-gray-500/20 text-gray-300 border border-gray-400/40';
  }
};

export default Homepage;