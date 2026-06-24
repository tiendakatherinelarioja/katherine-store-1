import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Lock, LogOut, ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onCartOpen }) {
  const { cartCount, view, setView, userRole, logoutAdmin, user, setIsAuthModalOpen, setAuthModalTab } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (userRole === 'admin' || userRole === 'superadmin') {
      setView('admin');
    } else {
      setView('login');
    }
  };

  const navLinks = [
    { label: 'Inicio', action: () => { setMobileMenuOpen(false); setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, active: view === 'home' },
    { label: 'Catálogo', action: () => { setMobileMenuOpen(false); setView('catalog'); }, active: view === 'catalog' },
    { label: '¿Cómo comprar?', action: () => { setMobileMenuOpen(false); setView('howtobuy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, active: view === 'howtobuy' },
    { label: 'Contacto', action: () => { setMobileMenuOpen(false); setView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, active: view === 'contact' },
    { label: 'Mis Pedidos', action: () => { setMobileMenuOpen(false); setView('myorders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, active: view === 'myorders' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs' : 'bg-white border-b border-gray-100'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Left Section: Desktop Navigation Links (Capsule style) */}
        <div className="hidden lg:flex items-center gap-0.5 text-[11px] font-bold text-gray-500 bg-gray-50/80 p-1 rounded-full border border-gray-200/60 backdrop-blur-sm">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                link.active
                  ? 'bg-charcoal text-white shadow-xs'
                  : 'text-gray-600 hover:text-charcoal hover:bg-white/70'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Center: Logo */}
        <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 flex items-center justify-center">
          <button
            className="flex items-center hover:opacity-80 transition-opacity focus:outline-none shrink-0"
            onClick={() => { setView('home'); setMobileMenuOpen(false); }}
          >
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Katherine"
                onError={() => setLogoError(true)}
                className="h-7 lg:h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-jakarta font-medium text-charcoal tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-charcoal" />
                Katherine
              </span>
            )}
          </button>
        </div>

        {/* Right Section: Action Icons */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Search */}
          <button
            onClick={() => setView('catalog')}
            className="p-2.5 rounded-full text-gray-500 hover:bg-gray-50 hover:text-charcoal border border-transparent hover:border-gray-200 transition-all hidden lg:flex items-center justify-center cursor-pointer"
            title="Buscar productos"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* User Profile */}
          <button
            onClick={() => {
              if (user) {
                setView('myaccount');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }
            }}
            className={`p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer relative ${
              user
                ? 'bg-gray-50 border-gray-200 text-charcoal hover:border-charcoal'
                : 'bg-white border-transparent text-gray-500 hover:border-gray-200 hover:text-charcoal'
            }`}
            title={user ? 'Mi Cuenta' : 'Iniciar Sesión'}
          >
            <User className="w-4.5 h-4.5" />
            {user && (
              <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white" />
            )}
          </button>

          {/* Admin Lock */}
          <button
            onClick={handleAdminClick}
            className={`p-2.5 rounded-full border transition-all items-center justify-center cursor-pointer hidden lg:flex ${
              view === 'admin' || view === 'login'
                ? 'bg-charcoal border-charcoal text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:border-charcoal hover:text-charcoal'
            }`}
            title={userRole ? 'Panel Admin' : 'Acceso Admin'}
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Logout Admin */}
          {userRole && (
            <button
              onClick={logoutAdmin}
              className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer hidden lg:flex"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="p-2.5 rounded-full border border-gray-200 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all flex items-center justify-center cursor-pointer relative"
            title="Ver carrito"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-charcoal text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold border-2 border-white"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2.5 rounded-full border border-gray-200 text-charcoal hover:bg-gray-50 lg:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 px-4 py-6 flex flex-col gap-1 shadow-xl absolute w-full left-0 z-30"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className={`text-left px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                  link.active
                    ? 'bg-charcoal text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-gray-100 my-3" />

            <button
              onClick={() => { setView('catalog'); setMobileMenuOpen(false); }}
              className="text-left px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Buscar Productos
            </button>

            <button
              onClick={() => {
                if (user) {
                  setView('myaccount');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="text-left px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              {user ? 'Mi Cuenta' : 'Iniciar Sesión'}
            </button>

            <button
              onClick={handleAdminClick}
              className={`text-left px-4 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer border ${
                view === 'admin' || view === 'login'
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              {userRole ? 'Panel de Administración' : 'Acceso Administrativo'}
            </button>

            {userRole && (
              <button
                onClick={() => { logoutAdmin(); setMobileMenuOpen(false); }}
                className="text-left px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
