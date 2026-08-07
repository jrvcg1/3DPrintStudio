import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WebLoginScreenProps {
  onContinueAsGuest: () => void;
}

export const WebLoginScreen: React.FC<WebLoginScreenProps> = ({ onContinueAsGuest }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError, loading } = useAuth();
  
  const [authMode, setAuthMode] = useState<'google' | 'email_login' | 'email_signup'>('google');
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setSigningIn(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setSigningIn(true);
    try {
      if (authMode === 'email_signup') {
        await signUpWithEmail(email, password, displayName || 'Cliente 3D');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      console.warn('Email auth error:', err);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6 relative z-10 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 mx-auto">
            <div className="w-full h-full bg-[#0A0D14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              3D Print <span className="text-gradient">Studio</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Impresión 3D de alta precisión y productos personalizados
            </p>
          </div>
        </div>

        {/* Toggle Mode Tabs */}
        <div className="w-full glass-card rounded-2xl p-1 border border-white/10 flex items-center gap-1">
          <button
            onClick={() => setAuthMode('google')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'google'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setAuthMode('email_login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'email_login' || authMode === 'email_signup'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email
          </button>
        </div>

        {/* GOOGLE MODE */}
        {authMode === 'google' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn || loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              {signingIn ? (
                <>
                  <Loader className="w-5 h-5 animate-spin text-slate-500" />
                  <span>Conectando con Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuar con Google</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* EMAIL MODE */}
        {(authMode === 'email_login' || authMode === 'email_signup') && (
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
            {authMode === 'email_signup' && (
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Ej: Carlos Ruiz"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Correo Electrónico:</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tuemail@ejemplo.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Contraseña:</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={signingIn}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all mt-2"
            >
              {signingIn ? 'Procesando...' : authMode === 'email_signup' ? 'Registrarse' : 'Iniciar Sesión'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'email_signup' ? 'email_login' : 'email_signup')}
                className="text-xs text-cyan-400 font-bold hover:underline"
              >
                {authMode === 'email_signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
              </button>
            </div>
          </form>
        )}

        {/* Error alert */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
            <span>⚠️ {authError}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-slate-500 font-medium">O</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Guest access */}
        <button
          onClick={onContinueAsGuest}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all active:scale-95 hover:text-white"
        >
          <span>Explorar catálogo como invitado</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Tus datos se emplean únicamente para identificarte y sincronizar tus pedidos 3D.
        </p>
      </div>
    </div>
  );
};
