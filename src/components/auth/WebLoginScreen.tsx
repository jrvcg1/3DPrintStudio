import React, { useState } from 'react';
import { Sparkles, Loader, ArrowRight, ShieldCheck, Box, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WebLoginScreenProps {
  onContinueAsGuest: () => void;
}

export const WebLoginScreen: React.FC<WebLoginScreenProps> = ({ onContinueAsGuest }) => {
  const { signInWithGoogle, authError, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-[#0A0D14]">

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full filter blur-[140px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Login Card */}
      <div className="w-full max-w-md z-10 space-y-8 animate-fadeIn">

        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-2xl shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0A0D14] rounded-[22px] flex items-center justify-center">
                <Box className="w-11 h-11 text-cyan-400 animate-pulse" />
              </div>
            </div>
            {/* Ambient glow */}
            <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-xl -z-10" />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              3D Print <span className="text-gradient">Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
              Piezas y diseños 3D personalizados · Calidad Profesional
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {['🖨️ Catálogo completo', '💬 Pedidos WhatsApp', '⚡ Tiempo real'].map(badge => (
              <span
                key={badge}
                className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Form Container Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-white">Acceso a la Plataforma</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprobando sesión previa... Inicia sesión o regístrate con Google para gestionar tu catálogo y tus pedidos.
            </p>
          </div>

          {/* Primary Action: Google Sign-In / Sign-Up */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn || loading}
              className="w-full flex items-center justify-center gap-3.5 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm transition-all duration-200 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-white/10"
            >
              {signingIn ? (
                <>
                  <Loader className="w-5 h-5 animate-spin text-slate-600" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  {/* Google SVG Logo */}
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

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">o también</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Secondary Action: Guest Mode */}
          <button
            onClick={onContinueAsGuest}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-white/10 transition-all active:scale-98"
          >
            <span>Explorar catálogo como invitado</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-500 text-center leading-relaxed max-w-xs mx-auto">
          Al identificarte aceptas nuestra política de privacidad. Tu cuenta Google solo se utiliza para autenticarnos y vincular tu perfil.
        </p>
      </div>
    </div>
  );
};
