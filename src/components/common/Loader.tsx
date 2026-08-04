import React from 'react';
import { Box } from 'lucide-react';

export const Loader: React.FC<{ text?: string }> = ({ text = 'Cargando modelos 3D...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-600 animate-spin blur-md opacity-60" />
        <div className="relative w-14 h-14 bg-[#0A0D14] rounded-2xl border border-white/20 flex items-center justify-center shadow-xl">
          <Box className="w-7 h-7 text-cyan-400 animate-bounce" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-300 tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
};
