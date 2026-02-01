import { useState } from 'react';
import { Link } from 'react-router';
import { Code2, Mail, Github, Linkedin, Send, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

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
            <MessageSquare className="h-4 w-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">Get in Touch</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
            Let's
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Connect</span>
          </h1>
          <p className="text-lg lg:text-xl text-purple-100/80 leading-relaxed">
            Have questions about NG AlgoVista? Want to collaborate or provide feedback? 
            I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Contact Info - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Social Links */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Mail className="h-6 w-6 text-purple-400" />
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <a 
                  href="https://github.com/namragajera" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">GitHub</p>
                    <p className="text-purple-300 text-sm">@namragajera</p>
                  </div>
                </a>

                <a 
                  href="https://linkedin.com/in/namragajera" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">LinkedIn</p>
                    <p className="text-purple-300 text-sm">Namra Gajera</p>
                  </div>
                </a>

                <a 
                  href="mailto:namra.gajera@example.com" 
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-pink-400/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-purple-300 text-sm">namra.gajera@example.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Why Reach Out?</h3>
              <ul className="space-y-3 text-purple-100/80">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  <span>Bug reports or technical issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  <span>Feature suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  <span>Collaboration opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                  <span>General feedback or questions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 flex items-center gap-2">
                <Send className="h-7 w-7 text-pink-400" />
                Send a Message
              </h2>
              
              {submitted ? (
                <div className="bg-green-500/20 border border-green-400/50 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-green-100">Thank you for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2" htmlFor="email">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2" htmlFor="message">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Tell me what's on your mind..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-md py-8 text-center text-purple-300 text-sm mt-12">
        <p>© 2026 NG AlgoVista. Built by Namra Gajera.</p>
      </footer>
    </div>
  );
};

export default Contact;
