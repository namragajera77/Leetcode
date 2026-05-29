import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Code2, Github, Linkedin, Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <main className="app-shell min-h-screen">
      <nav className="border-b border-slate-700/40 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient text-slate-950">
              <Code2 className="h-6 w-6" />
            </span>
            <span className="text-lg font-black text-white">AI-Based Coding Interview Preparation Platform</span>
          </Link>
          <Link to="/" className="btn-secondary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-bold text-cyan-200">
            <MessageSquare className="h-4 w-4" />
            Get in touch
          </div>
          <h1 className="text-5xl font-black leading-tight text-white lg:text-7xl">Let's connect.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">Questions, feedback, collaborations, or bug reports are welcome.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <ContactLink icon={Github} label="GitHub" value="@namragajera" href="https://github.com/namragajera" />
            <ContactLink icon={Linkedin} label="LinkedIn" value="Namra Gajera" href="https://linkedin.com/in/namragajera" />
            <ContactLink icon={Mail} label="Email" value="namra.gajera@example.com" href="mailto:namra.gajera@example.com" />
          </aside>

          <div className="surface-strong rounded-lg p-6 lg:p-8">
            {submitted ? (
              <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-8 text-center">
                <Send className="mx-auto h-10 w-10 text-emerald-300" />
                <h2 className="mt-4 text-2xl font-black text-white">Message sent</h2>
                <p className="mt-2 text-emerald-100">Thank you for reaching out. I will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Your Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                <Field label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-200">Your Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="6" placeholder="Tell me what's on your mind..." className="field-premium w-full resize-none px-4 py-3" />
                </div>
                <button type="submit" className="btn-primary-premium inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-lg font-black">
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-200">{label}</label>
    <input {...props} required className="field-premium w-full px-4 py-3" />
  </div>
);

const ContactLink = ({ icon: Icon, label, value, href }) => (
  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="premium-card flex items-center gap-4 p-5">
    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-cyan-300 ring-1 ring-cyan-400/20">
      <Icon className="h-6 w-6" />
    </span>
    <span>
      <span className="block font-black text-white">{label}</span>
      <span className="text-sm font-semibold text-slate-400">{value}</span>
    </span>
  </a>
);

export default Contact;
