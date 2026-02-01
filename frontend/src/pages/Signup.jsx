import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {registerUser} from '../authSlice'
import { useEffect } from 'react';
import { Eye, EyeOff, Code2, Sparkles, UserPlus } from 'lucide-react';

// Zod validation schema
const signUpSchema = z
  .object({
    firstname: z.string().min(3, "Name must be at least 3 characters"),
    emailid: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated,navigate]);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}


const onSubmit = (data) => {
  const payload = {
    firstname: data.firstname,
    emailid: data.emailid,
    password: data.password
  };

  dispatch(registerUser(payload));
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 px-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
      
      <div className="w-full max-w-lg relative z-10 animate-fadeIn">
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Code2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black text-center mb-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              NG AlgoVista
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-center text-purple-300/80 text-sm mb-2 font-medium">
            Start your algorithm learning journey
          </p>

          {/* Subheading */}
          <h2 className="text-3xl font-bold text-center text-white mb-8">Create Your Account</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-2 block">Full Name</label>
            <input
              {...register('firstname')}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
            {errors.firstname && <p className="text-red-400 text-sm mt-2">{errors.firstname.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-2 block">Email Address</label>
            <input
              {...register('emailid')}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              type="email"
            />
            {errors.emailid && <p className="text-red-400 text-sm mt-2">{errors.emailid.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/70 hover:text-purple-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-2 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register('confirmPassword')}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/70 hover:text-purple-200 transition-colors"
                title={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-purple-200/80 mt-6 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-purple-300 hover:text-white font-semibold underline underline-offset-2 transition-colors">
            Sign In
          </a>
        </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
