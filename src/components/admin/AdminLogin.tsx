import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, Shield, AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { api } from '../../api.js';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
  onSuccess?: () => void;
  onBackToPublic?: () => void;
  onBackToSite?: () => void;
  accentColor?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onSuccess,
  onBackToPublic,
  onBackToSite,
  accentColor = '#e5a93c'
}) => {
  const [email, setEmail] = useState('farhantasneem2004@gmail.com');
  const [password, setPassword] = useState('AdminFarhan2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (onBackToPublic) onBackToPublic();
    if (onBackToSite) onBackToSite();
  };

  const handleFillDefaults = () => {
    setEmail('farhantasneem2004@gmail.com');
    setPassword('AdminFarhan2026!');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.login({ email: email.trim(), password });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.08] pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Back button */}
      <button
        id="admin-return-btn"
        onClick={handleBack}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#9ca3af] hover:text-white bg-[#12151b] border border-[#222732] hover:border-[#374151] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Portfolio</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#11141c] border border-[#1f2533] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4 bg-[#181c25] border border-[#273042]"
            style={{ color: accentColor }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
            Admin Authentication
          </h1>
          <p className="text-xs text-[#848ea0]">
            Secure administrative control suite for Farhan Tasneem
          </p>
        </div>

        {/* Credentials Note Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#141822] border border-[#232a3b] text-xs text-[#94a3b8] flex flex-col gap-2.5">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" style={{ color: accentColor }} />
            <div>
              <span className="font-semibold text-white block mb-0.5">Admin Account Credentials</span>
              <div className="font-mono text-[11px] text-[#cbd5e1] space-y-0.5 mt-1">
                <div>Email: <span className="text-amber-300">farhantasneem2004@gmail.com</span></div>
                <div>Password: <span className="text-amber-300">AdminFarhan2026!</span></div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDefaults}
            className="self-start text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{ color: accentColor }}
          >
            <KeyRound className="w-3 h-3" />
            <span>Auto-fill default credentials</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5" htmlFor="admin-email">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c0e12] border border-[#222732] text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-[#4b5563]"
                placeholder="farhantasneem2004@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9ca3af] mb-1.5" htmlFor="admin-pass">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0c0e12] border border-[#222732] text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-[#4b5563]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#9ca3af] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg text-sm font-semibold text-[#0c0e12] transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? 'Authenticating...' : 'Authenticate & Enter'}
          </button>
        </form>

      </div>
    </div>
  );
};
