import { Link } from 'react-router';
import { Code2 } from 'lucide-react';

export default function SignedOut() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md animate-fadeIn">
        <div className="surface-strong rounded-lg p-8 lg:p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg accent-gradient text-slate-950 shadow-lg shadow-cyan-500/20">
              <Code2 className="h-8 w-8" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-white">Signed out</h1>
          <p className="mt-2 text-sm text-slate-400">AI-Based Coding Interview Preparation Platform</p>

          <div className="mt-6">
            <Link to="/login" className="btn-primary-premium rounded-lg px-6 py-3 font-black">
              Sign in again
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
