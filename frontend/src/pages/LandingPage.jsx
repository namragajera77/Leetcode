import { Link } from 'react-router';
import { Code2, Sparkles, TrendingUp, Eye, Zap, BookOpen, ArrowRight } from 'lucide-react';

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden relative">
    {/* Ambient glow effects */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
    
    {/* Header/Navbar */}
    <nav className="relative z-10 flex justify-between items-center px-8 lg:px-16 py-6 bg-white/5 backdrop-blur-xl shadow-2xl border-b border-white/10">
      <div className="flex flex-col">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-2">
          <Code2 className="h-8 w-8 text-purple-300" />
          NG AlgoVista
        </h1>
        <p className="text-xs lg:text-sm text-purple-200/80 ml-10 mt-1 font-light tracking-wide">
          Learn. Visualize. Master Algorithms.
        </p>
      </div>
      <div className="flex items-center gap-4 lg:gap-6">
        <Link 
          to="/about" 
          className="text-purple-200 hover:text-white transition-colors font-medium hidden sm:block"
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className="text-purple-200 hover:text-white transition-colors font-medium hidden sm:block"
        >
          Contact
        </Link>
        <Link 
          to="/login" 
          className="px-5 lg:px-6 py-2.5 rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 font-semibold text-sm lg:text-base backdrop-blur-sm"
        >
          Sign In
        </Link>
        <Link 
          to="/signup" 
          className="px-5 lg:px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold text-sm lg:text-base flex items-center gap-2"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative z-10 flex flex-col items-center justify-center px-8 py-20 lg:py-32 text-center">
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-yellow-300" />
        <span className="text-purple-200">AI-Powered Learning Platform</span>
      </div>
      
      <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight max-w-5xl">
        <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-2xl">
          Visualize Algorithms.
        </span>
        <br />
        <span className="bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
          Solve with Confidence.
        </span>
      </h1>
      
      <p className="text-lg lg:text-xl text-purple-100/90 mb-12 max-w-3xl leading-relaxed font-light">
        NG AlgoVista helps you understand data structures and algorithms through 
        <span className="font-semibold text-white"> interactive visualization</span> and 
        <span className="font-semibold text-white"> real coding problems</span> — 
        powered by real execution and AI guidance.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
        <Link 
          to="/signup" 
          className="group px-8 lg:px-10 py-4 lg:py-5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 font-bold text-lg lg:text-xl flex items-center justify-center gap-3"
        >
          Start Learning Free
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          to="/signup" 
          className="px-8 lg:px-10 py-4 lg:py-5 rounded-2xl border-2 border-white/40 hover:border-white/70 hover:bg-white/10 backdrop-blur-md transition-all duration-300 font-bold text-lg lg:text-xl flex items-center justify-center gap-3"
        >
          <Eye className="h-5 w-5" />
          Explore Visualizer
        </Link>
      </div>

      {/* Badge */}
      <div className="mt-16 flex flex-col items-center gap-2">
        <div className="px-6 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-full border border-indigo-300/30">
          <p className="text-sm font-semibold text-indigo-200">Built by Namra Gajera</p>
        </div>
        <p className="text-xs text-purple-300/70 font-light italic">Student-built, industry-inspired</p>
      </div>
    </section>

    {/* Feature Highlights */}
    <section className="relative z-10 px-8 lg:px-16 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 lg:gap-10">
        
        {/* Feature 1: Algorithm Visualization */}
        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30">
          <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Algorithm Visualization</h3>
          <p className="text-purple-100/80 leading-relaxed">
            See algorithms work step-by-step — sorting, searching, graphs, and more. 
            Watch data transform in real-time.
          </p>
        </div>

        {/* Feature 2: Real Coding Problems */}
        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/10 hover:border-pink-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-pink-500/30">
          <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Real Coding Problems</h3>
          <p className="text-purple-100/80 leading-relaxed">
            Solve problems using a real LeetCode-style judge with function-based execution. 
            Practice with instant feedback.
          </p>
        </div>

        {/* Feature 3: Learn Smarter */}
        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/10 hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/30">
          <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Learn Smarter</h3>
          <p className="text-purple-100/80 leading-relaxed">
            Understand logic faster with visual flow, AI explanations, and real-time 
            performance feedback.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="relative z-10 text-center py-12 border-t border-white/10 bg-white/5 backdrop-blur-md">
      <p className="text-lg lg:text-xl font-semibold text-purple-200 mb-2 italic">
        Not just practice. Real understanding.
      </p>
      <p className="text-sm text-purple-300/60">
        © 2026 NG AlgoVista. Crafted with passion for learners.
      </p>
    </footer>
  </div>
);

export default LandingPage;
