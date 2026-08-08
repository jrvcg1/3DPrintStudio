import React, { useState, useRef, useEffect } from 'react';
import { Box, Sun, Moon, Search, ShieldCheck, Menu, X, Sparkles, LogOut, LogIn, ChevronDown, Crown, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { BusinessConfig } from '../../types/config';

interface HeaderProps {
  config: BusinessConfig;
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenLogin?: () => void;
  onOpenMyOrders?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  currentTab,
  onNavigate,
  onOpenSearch,
  onOpenLogin,
  onOpenMyOrders
}) => {
  const { theme, toggleTheme } = useTheme();
  const { appUser, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'process', label: 'Proceso' },
    { id: 'faqs', label: 'Preguntas' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      {/* Announcement Banner */}
      {(config.showAnnouncementBanner ?? true) && config.announcementBanner && (
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
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              3D Print <span className="text-gradient">Studio</span>
            </span>
            <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
              Diseño & Impresión 3D
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                currentTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions & User Profile */}
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

          {/* My Orders Button (Logged in users) */}
          {appUser && onOpenMyOrders && (
            <button
              onClick={onOpenMyOrders}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Mis Pedidos</span>
            </button>
          )}

          {/* Admin Panel Access Button (Only for Admin users) */}
          {isAdmin && (
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
          )}

          {/* User Profile Avatar / Login Button */}
          <div className="relative" ref={dropdownRef}>
            {appUser ? (
              <>
                <button
                  onClick={() => setUserDropdownOpen(v => !v)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  {appUser.photoURL ? (
                    <img
                      src={appUser.photoURL}
                      alt={appUser.displayName}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-400/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white">
                      {appUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-slate-200 max-w-[100px] truncate">
                    {appUser.displayName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl border border-white/15 shadow-2xl z-50 overflow-hidden animate-fadeIn">
                    <div className="p-4 border-b border-white/10 space-y-1">
                      <p className="text-xs font-extrabold text-white truncate">{appUser.displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{appUser.email}</p>
                      {appUser.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-1">
                          <Crown className="w-3 h-3 text-purple-400" /> Administrador
                        </span>
                      )}
                    </div>

                    {onOpenMyOrders && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMyOrders();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cyan-300 hover:bg-cyan-500/10 font-bold transition-colors border-b border-white/5"
                      >
                        <ShoppingBag className="w-4 h-4 text-cyan-400" />
                        <span>Mis Pedidos 3D</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-purple-300 hover:bg-purple-500/10 font-bold transition-colors border-b border-white/5"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        <span>Panel de Administración</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-rose-400 hover:bg-rose-500/10 font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar sesión</span>
              </button>
            )}
          </div>

          {/* Mobile Drawer Menu Button */}
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

          {appUser && onOpenMyOrders && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyOrders();
              }}
              className="w-full flex items-center justify-center gap-2 mt-1 px-4 py-3 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 font-semibold"
            >
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              Mis Pedidos
            </button>
          )}

          {isAdmin && (
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
          )}

          {!appUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenLogin) onOpenLogin();
              }}
              className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm shadow-md"
            >
              <LogIn className="w-5 h-5" />
              Iniciar sesión / Registrarse
            </button>
          )}
        </div>
      )}
    </header>
  );
};
