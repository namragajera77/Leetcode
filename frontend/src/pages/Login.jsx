import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { loginUser } from '../authSlice';
import { ArrowRight, Code2, Eye, EyeOff, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  emailid: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const displayError = !errors.emailid && !errors.password && error && isSubmitted ? 'Invalid credentials' : null;

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md animate-fadeIn">
        <div className="surface-strong rounded-lg p-8 lg:p-10">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg accent-gradient text-slate-950 shadow-lg shadow-cyan-500/20">
              <Code2 className="h-8 w-8" />
            </div>
          </div>

          <h1 className="text-center text-4xl font-black text-white lg:text-5xl">NG AlgoVista</h1>
          <p className="mt-2 text-center text-sm font-semibold text-slate-400">Visualize. Solve. Master algorithms.</p>
          <h2 className="mb-8 mt-6 text-center text-2xl font-black text-white">Sign in to your workspace</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {displayError && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
                {displayError}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">Email Address</label>
              <input type="email" {...register('emailid')} placeholder="you@example.com" className="field-premium w-full px-4 py-3" />
              {errors.emailid && <p className="mt-2 text-sm text-red-300">{errors.emailid.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Enter your password" className="field-premium w-full px-4 py-3 pr-12" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-200" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary-premium flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-lg font-black transition disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-cyan-300 underline underline-offset-4 transition hover:text-white">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
