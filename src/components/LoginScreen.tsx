import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Users, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, registerWithEmail, resetPassword } from '../firebase';
import { Logo } from './Logo';
import { LoadingSpinner } from './LoadingSpinner';
import { ThemeToggle } from './ThemeToggle';

export const LoginScreen: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === 'login') {
        await loginWithEmail(email, password);
      } else if (view === 'signup') {
        if (!name.trim()) throw new Error("Please enter your name");
        await registerWithEmail(email, password, name);
      } else if (view === 'forgot-password') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err: any) {
      console.error("Auth error:", err.code, err.message);
      
      let userMessage = "Authentication failed. Please try again.";
      
      // Handle Firebase specific error codes
      if (err.code === 'auth/email-already-in-use') {
        userMessage = "This email is already registered. Please login instead.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        userMessage = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/weak-password') {
        userMessage = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        userMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        userMessage = "Too many failed attempts. Please try again later.";
      } else if (err.message) {
        // Fallback to Firebase message but strip the "Firebase:" prefix if it exists
        userMessage = err.message.replace("Firebase: ", "");
      }
      
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderForgotPassword = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white">Reset Password</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      {resetSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-8 rounded-[2rem] text-center space-y-5"
        >
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-100 dark:shadow-none">
            <ShieldCheck size={32} />
          </div>
          <p className="text-sm text-emerald-800 dark:text-emerald-200 font-bold">Reset link sent! Check your email inbox.</p>
          <button
            onClick={() => {
              setView('login');
              setResetSent(false);
            }}
            className="text-emerald-600 dark:text-emerald-400 font-bold text-sm underline hover:text-emerald-700 transition-colors"
          >
            Back to Login
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest px-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mama@example.com"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl pl-12 pr-4 py-4 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-pink-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/50"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-pink-600 text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 transition-all shadow-xl shadow-pink-100 dark:shadow-none active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
            ) : (
              <>
                Send Reset Link
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setView('login')}
            className="w-full text-stone-400 dark:text-stone-500 text-xs font-bold hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm space-y-10"
      >
        <div className="text-center space-y-5">
          <motion.div 
            whileHover={{ rotate: 5 }}
            className="w-24 h-24 bg-pink-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-pink-200 dark:shadow-none"
          >
            <Logo size={48} className="text-white" />
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">HERAXIS</h1>
            <p className="text-stone-500 dark:text-stone-400 font-bold text-sm tracking-wide uppercase">Your Maternal Health Companion</p>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none space-y-8 transition-colors">
          {view === 'forgot-password' ? (
            renderForgotPassword()
          ) : (
            <>
              <div className="flex p-1.5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700">
                <button
                  onClick={() => setView('login')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${view === 'login' ? 'bg-white dark:bg-stone-700 text-pink-600 dark:text-white shadow-md' : 'text-stone-400 dark:text-stone-500'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setView('signup')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${view === 'signup' ? 'bg-white dark:bg-stone-700 text-pink-600 dark:text-white shadow-md' : 'text-stone-400 dark:text-stone-500'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {view === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest px-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Mama Jane"
                          className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl pl-12 pr-4 py-4 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-pink-500 transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest px-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mama@example.com"
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl pl-12 pr-4 py-4 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Password</label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => setView('forgot-password')}
                        className="text-[10px] font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl pl-12 pr-12 py-4 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-pink-300 dark:focus:border-pink-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/50"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-pink-600 text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 transition-all shadow-xl shadow-pink-100 dark:shadow-none active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
                  ) : (
                    <>
                      {view === 'login' ? 'Login' : 'Create Account'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4 bg-white/50 dark:bg-stone-900/50 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 transition-colors">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-2.5 rounded-xl">
              <ShieldCheck size={24} className="text-pink-600 dark:text-pink-400" />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 text-left font-bold leading-relaxed tracking-tight">Your health data is encrypted and stored securely with end-to-end protection.</p>
          </div>
        </div>

        <p className="text-[10px] text-stone-400 dark:text-stone-500 leading-relaxed px-8 text-center font-medium">
          By continuing, you agree to our <span className="text-stone-600 dark:text-stone-300 underline">Terms of Service</span> and <span className="text-stone-600 dark:text-stone-300 underline">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};
