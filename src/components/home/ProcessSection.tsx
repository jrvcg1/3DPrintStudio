import React from 'react';
import { MousePointerClick, Palette, MessageSquareDot, ArrowRight } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Elige tu Diseño',
      description: 'Navega por nuestro catálogo de figuras, llaveros o accesorios y elige tu producto favorito.',
      icon: MousePointerClick,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      num: '02',
      title: 'Personaliza Colores',
      description: 'Selecciona los colores deseados (Azul Cyber, Neón, Negro Obsidian, etc.) o añade tu texto grabado.',
      icon: Palette,
      color: 'from-cyan-400 to-teal-400'
    },
    {
      num: '03',
      title: 'Pide por WhatsApp',
      description: 'Pulsa el botón "Pedir" y se abrirá el chat con todos los detalles ya escritos para enviarnos.',
      icon: MessageSquareDot,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
            Fácil & Sin Complicaciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            ¿Cómo realizar tu <span className="text-gradient">Pedido</span>?
          </h2>
          <p className="text-sm text-slate-400">
            Sin formularios interminables ni registros de contraseña. Todo en 3 pasos ultrarrápidos.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative glass-card p-8 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 group"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full bg-[#0A0D14] rounded-[15px] flex items-center justify-center text-cyan-300">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <span className="text-4xl font-black text-white/20 group-hover:text-cyan-400/40 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
