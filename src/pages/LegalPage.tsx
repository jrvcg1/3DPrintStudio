import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl font-extrabold text-white">Aviso Legal</h1>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">1. Información General</h2>
        <p>
          En cumplimiento con la legislación vigente, se informa que este sitio web <strong>3D Print Studio</strong> opera como una vitrina de productos de fabricación aditiva e impresión 3D bajo gestión directa.
        </p>

        <h2 className="text-lg font-bold text-white">2. Propiedad Intelectual</h2>
        <p>
          Los modelos 3D mostrados pertenecen a diseños propios o licencias de uso comercial libre (Creative Commons CC-BY o licencias comerciales de diseñadores verificados).
        </p>

        <h2 className="text-lg font-bold text-white">3. Modalidad de Compra</h2>
        <p>
          La plataforma procesa pedidos directamente a través de nuestra base de datos segura con código de seguimiento en tiempo real y confirmación de compra.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-extrabold text-white">Política de Privacidad y Cookies</h1>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">1. Protección de Datos</h2>
        <p>
          Respetamos tu privacidad al 100%. No compartimos tus datos de contacto con terceros ni los utilizamos para spam.
        </p>

        <h2 className="text-lg font-bold text-white">2. Uso de Cookies Técnicas</h2>
        <p>
          Esta aplicación únicamente utiliza cookies locales imprescindibles (LocalStorage) para recordar tu preferencia de tema (Modo Claro / Modo Oscuro) y tus filtros de búsqueda.
        </p>
      </div>
    </div>
  );
};
