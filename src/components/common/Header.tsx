import React, { useState } from 'react';
import { Box, Sun, Moon, Search, SlidersHorizontal, ShieldCheck, Menu, X, MessageSquare, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessConfig } from '../../types/config';

interface HeaderProps {
  config: BusinessConfig;
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  currentTab,
  onNavigate,
  onOpenSearch
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'process', label: 'Proceso' },
    { id: 'faqs', label: 'Preguntas' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      {/* Announcement Banner */}
      {config.announcementBanner && (
        <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide overflow-hidden flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{config.announcementBanner}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0A0D14] rounded-[14px] flex items-center justify-center">
              <Box className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white dark:text-white text-slate-900 flex items-center gap-1.5">
              3D Print <span className="text-gradient">Studio</span>
            </span>
            <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
              Diseño & Impresión 3D
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 dark:bg-white/5 bg-slate-900/5 p-1.5 rounded-full border border-white/10 dark:border-white/10 border-slate-200">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                currentTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-300 dark:text-slate-300 text-slate-600 hover:text-white dark:hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions & Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              aria-label="Buscar en el catálogo"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema claro u oscuro"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* Admin Panel Access Button */}
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              currentTab === 'admin'
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                : 'bg-white/5 hover:bg-purple-500/10 text-slate-300 border-white/10 hover:border-purple-500/30 hover:text-purple-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Panel Admin</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú de navegación"
            className="md:hidden p-2.5 rounded-xl bg-white/5 text-slate-300 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-header border-b border-white/10 px-4 py-6 flex flex-col gap-3 animate-in slide-in-from-top duration-200">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                currentTab === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold"
          >
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Panel de Administración
          </button>
        </div>
      )}
    </header>
  );
};
