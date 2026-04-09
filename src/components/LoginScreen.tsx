import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, Users, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, registerWithEmail, resetPassword } from '../firebase';

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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-stone-800">Reset Password</h2>
        <p className="text-sm text-stone-500">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      {resetSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center space-y-4"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white">
            <ShieldCheck size={24} />
          </div>
          <p className="text-sm text-emerald-800 font-medium">Reset link sent! Check your email inbox.</p>
          <button
            onClick={() => {
              setView('login');
              setResetSent(false);
            }}
            className="text-emerald-600 font-bold text-sm underline"
          >
            Back to Login
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mama@example.com"
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-pink-300 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl text-xs font-medium">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-100 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            className="w-full text-stone-400 text-xs font-bold hover:text-stone-600 transition-colors"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-pink-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-pink-100">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">HERAXIS</h1>
          <p className="text-stone-500 font-medium">Your Maternal Health Companion</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
          {view === 'forgot-password' ? (
            renderForgotPassword()
          ) : (
            <>
              <div className="flex p-1 bg-stone-50 rounded-2xl border border-stone-100">
                <button
                  onClick={() => setView('login')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'login' ? 'bg-white text-pink-600 shadow-sm' : 'text-stone-400'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setView('signup')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'signup' ? 'bg-white text-pink-600 shadow-sm' : 'text-stone-400'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {view === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Mama Jane"
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-pink-300 transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mama@example.com"
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-pink-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Password</label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => setView('forgot-password')}
                        className="text-[10px] font-bold text-pink-600 hover:text-pink-700 transition-colors"
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
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-pink-300 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl text-xs font-medium"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-100 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-stone-100">
            <ShieldCheck size={20} className="text-pink-600" />
            <p className="text-[11px] text-stone-500 text-left font-medium">Your health data is encrypted and stored securely.</p>
          </div>
        </div>

        <p className="text-[10px] text-stone-400 leading-relaxed px-4 text-center">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </motion.div>
    </div>
  );
};
