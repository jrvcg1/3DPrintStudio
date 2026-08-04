import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0D14] flex flex-col items-center justify-center p-6 text-center text-slate-100">
          <div className="max-w-md glass-card p-8 rounded-3xl border border-rose-500/30 space-y-4 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold">Algo no salió como esperábamos</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || 'Se produjo un error al renderizar la aplicación.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Limpiar Datos & Recargar</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
