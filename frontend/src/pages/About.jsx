import { Link } from 'react-router';
import { Code2, Eye, Zap, BookOpen, Layers, CheckCircle, Sparkles, TrendingUp, User } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">NG AlgoVista</span>
          </Link>
          <Link to="/" className="text-purple-300 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 py-16 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-400/30">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">About NG AlgoVista</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
            Learn Algorithms Through
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Visualization & Practice</span>
          </h1>
          <p className="text-lg lg:text-xl text-purple-100/80 leading-relaxed">
            NG AlgoVista is an interactive algorithm learning platform designed to help developers 
            <span className="font-semibold text-white"> deeply understand</span> data structures and algorithms 
            instead of just memorizing solutions.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
            <BookOpen className="h-12 w-12 text-purple-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Learning-First Approach</h2>
            <p className="text-purple-100/80 leading-relaxed mb-4">
              We believe in <span className="font-semibold text-white">understanding over memorization</span>. 
              NG AlgoVista combines visual learning with hands-on practice to help you build 
              strong foundational knowledge that lasts.
            </p>
            <p className="text-purple-100/80 leading-relaxed">
              Every problem is an opportunity to learn a concept, not just pass a test case.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
            <Eye className="h-12 w-12 text-pink-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">See Algorithms in Action</h2>
            <p className="text-purple-100/80 leading-relaxed mb-4">
              Watch sorting, searching, and graph algorithms execute <span className="font-semibold text-white">step-by-step</span> 
              in real-time. Visualize how data transforms, how recursion unfolds, and how complexity affects performance.
            </p>
            <p className="text-purple-100/80 leading-relaxed">
              Visual learning accelerates comprehension and retention.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-black text-white text-center mb-12">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Eye className="h-8 w-8" />}
            title="Algorithm Visualization"
            description="Step-by-step visual representation of sorting, searching, graphs, and more."
          />
          <FeatureCard 
            icon={<Zap className="h-8 w-8" />}
            title="LeetCode-Style Problems"
            description="Solve real coding challenges with function-based execution and instant feedback."
          />
          <FeatureCard 
            icon={<CheckCircle className="h-8 w-8" />}
            title="Real Test Execution"
            description="Code runs on Judge0 with visible and hidden test cases for authentic validation."
          />
          <FeatureCard 
            icon={<Layers className="h-8 w-8" />}
            title="Clean Interactive UI"
            description="Monaco Editor, syntax highlighting, and modern responsive design."
          />
          <FeatureCard 
            icon={<TrendingUp className="h-8 w-8" />}
            title="Progress Tracking"
            description="Monitor your solved problems, submissions, and improvement over time."
          />
          <FeatureCard 
            icon={<Sparkles className="h-8 w-8" />}
            title="AI-Powered Hints"
            description="Get intelligent explanations and guidance when you're stuck on a problem."
          />
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-purple-400/30 shadow-2xl">
          <h2 className="text-3xl lg:text-4xl font-black text-white text-center mb-8">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                Frontend
              </h3>
              <ul className="space-y-2 text-purple-100/80">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  React.js (Component-based UI)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Tailwind CSS (Modern styling)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Framer Motion (Smooth animations)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Monaco Editor (Code editing)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-pink-300 mb-4 flex items-center gap-2">
                <Layers className="h-6 w-6" />
                Backend
              </h3>
              <ul className="space-y-2 text-purple-100/80">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Node.js + Express.js (REST API)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  MongoDB (Database)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Judge0 (Code execution engine)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  JWT Authentication (Secure access)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="px-6 lg:px-8 py-12 lg:py-16 max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Namra Gajera</h2>
          <p className="text-purple-300 font-semibold mb-6">Frontend / Full-Stack Developer</p>
          <blockquote className="text-lg lg:text-xl text-purple-100/90 italic leading-relaxed max-w-3xl mx-auto mb-6">
            "I built NG AlgoVista because I believe algorithms shouldn't feel intimidating. 
            When you can <span className="font-semibold text-white">see how they work</span> and 
            <span className="font-semibold text-white"> practice solving problems</span>, 
            complex concepts become clear. My goal is to help learners move from confusion to confidence."
          </blockquote>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-300">
            <span className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">React.js</span>
            <span className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">Node.js</span>
            <span className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">Full-Stack</span>
            <span className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">Algorithms</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-16 lg:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">
            Ready to Master Algorithms?
          </h2>
          <p className="text-lg text-purple-100/80 mb-8">
            Join NG AlgoVista today and start your journey to becoming a confident problem solver.
          </p>
          <Link 
            to="/signup" 
            className="inline-block px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-md py-8 text-center text-purple-300 text-sm">
        <p>© 2026 NG AlgoVista. Built by Namra Gajera.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 shadow-xl">
    <div className="text-purple-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-purple-100/70 text-sm leading-relaxed">{description}</p>
  </div>
);

export default About;
