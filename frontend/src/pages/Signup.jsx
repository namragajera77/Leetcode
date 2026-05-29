import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { registerUser } from '../authSlice';
import { ArrowRight, Code2, Eye, EyeOff, UserPlus } from 'lucide-react';

const signUpSchema = z
  .object({
    firstname: z.string().min(3, 'Name must be at least 3 characters'),
    emailid: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser({
      firstname: data.firstname,
      emailid: data.emailid,
      password: data.password,
    }));
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg animate-fadeIn">
        <div className="surface-strong rounded-lg p-8 lg:p-10">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg accent-gradient text-slate-950 shadow-lg shadow-cyan-500/20">
              <Code2 className="h-8 w-8" />
            </div>
          </div>

          <h1 className="text-center text-4xl font-black text-white lg:text-5xl">NG AlgoVista</h1>
          <p className="mt-2 text-center text-sm font-semibold text-slate-400">Start your algorithm learning journey.</p>
          <h2 className="mb-8 mt-6 text-center text-2xl font-black text-white">Create your account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">Full Name</label>
              <input {...register('firstname')} placeholder="Your name" className="field-premium w-full px-4 py-3" />
              {errors.firstname && <p className="mt-2 text-sm text-red-300">{errors.firstname.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">Email Address</label>
              <input {...register('emailid')} type="email" placeholder="you@example.com" className="field-premium w-full px-4 py-3" />
              {errors.emailid && <p className="mt-2 text-sm text-red-300">{errors.emailid.message}</p>}
            </div>

            <PasswordField label="Password" show={showPassword} setShow={setShowPassword} register={register('password')} error={errors.password?.message} placeholder="Create a password" />
            <PasswordField label="Confirm Password" show={showConfirm} setShow={setShowConfirm} register={register('confirmPassword')} error={errors.confirmPassword?.message} placeholder="Confirm your password" />

            <button type="submit" disabled={loading} className="btn-primary-premium flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-lg font-black transition disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-300 underline underline-offset-4 transition hover:text-white">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

const PasswordField = ({ label, show, setShow, register, error, placeholder }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-200">{label}</label>
    <div className="relative">
      <input type={show ? 'text' : 'password'} {...register} placeholder={placeholder} className="field-premium w-full px-4 py-3 pr-12" />
      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-200" onClick={() => setShow(!show)} title={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
  </div>
);

export default Signup;
