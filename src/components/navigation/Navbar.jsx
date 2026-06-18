import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Lock, LogOut, ShoppingCart, Search, User, Menu, X, Globe } from 'lucide-react';

export default function Navbar({ onCartOpen }) {
  const { cartCount, view, setView, userRole, logoutAdmin } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Scroll spy effect when on Home page
  React.useEffect(() => {
    if (view !== 'home') return;

    const handleScroll = () => {
      const howToBuyElement = document.getElementById('how-to-buy');
      const footerElement = document.querySelector('footer');
      const scrollPos = window.scrollY + 140; // sticky header offset

      if (footerElement && scrollPos >= footerElement.offsetTop - window.innerHeight / 2) {
        setActiveSection('contacto');
      } else if (howToBuyElement && scrollPos >= howToBuyElement.offsetTop - 120) {
        setActiveSection('how-to-buy');
      } else {
        setActiveSection('inicio');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial trigger

    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (userRole === 'admin' || userRole === 'superadmin') {
      setView('admin');
    } else {
      setView('login');
    }
  };

  const isInicioActive = (view === 'home' && activeSection === 'inicio');
  const isCatalogActive = (view === 'catalog');
  const isHowToBuyActive = (view === 'howtobuy' || (view === 'home' && activeSection === 'how-to-buy'));
  const isContactActive = (view === 'contact' || (view === 'home' && activeSection === 'contacto'));

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Left Section: Navigation Links in capsule */}
        <div className="hidden md:flex items-center gap-1 text-xs font-bold text-gray-505 bg-gray-50 p-1.5 rounded-full border border-gray-200/60 max-w-max">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (view !== 'home') {
                setView('home');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              isInicioActive
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/45'
                : 'hover:text-black hover:bg-gray-100/40'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setView('catalog');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              isCatalogActive
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/45'
                : 'hover:text-black hover:bg-gray-100/40'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setView('howtobuy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              isHowToBuyActive
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/45'
                : 'hover:text-black hover:bg-gray-100/40'
            }`}
          >
            ¿Cómo comprar?
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              isContactActive
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200/45'
                : 'hover:text-black hover:bg-gray-100/40'
            }`}
          >
            Contacto
          </button>
        </div>

        {/* Center Section: Logo Centered */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
          <button 
            className="flex items-center hover:opacity-80 transition-opacity focus:outline-none shrink-0"
            onClick={() => {
              setView('home');
              setMobileMenuOpen(false);
            }}
          >
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Logo" 
                onError={() => setLogoError(true)} 
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="text-2xl font-bold flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-950 inline-block"></span>
                Katherine
              </div>
            )}
          </button>
        </div>

        {/* Right Section: Utilities & Actions */}
        <div className="flex items-center gap-4 ml-auto">
          
          {/* Admin Lock Access Icon */}
          <button
            onClick={handleAdminClick}
            className={`p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
              view === 'admin' || view === 'login'
                ? 'bg-zinc-950 border-zinc-950 text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:border-zinc-800 hover:text-black'
            }`}
            title={userRole ? 'Ver Panel de Admin' : 'Acceso Administrativo'}
          >
            <Lock className="w-5 h-5" />
          </button>
 
          {/* Logout if authenticated */}
          {userRole && (
            <button
              onClick={logoutAdmin}
              className="p-2 bg-white border border-gray-200 text-gray-400 hover:border-red-600 hover:text-red-600 hover:bg-red-50/20 rounded-full transition-all cursor-pointer"
              title="Cerrar Sesión de Admin"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
 
          {/* Search Icon */}
          <button 
            onClick={() => setView('catalog')}
            className="p-2 text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:text-black rounded-full transition-colors hidden sm:inline-flex cursor-pointer"
            title="Buscar productos"
          >
            <Search className="w-5 h-5" />
          </button>
 
          {/* Cart Icon */}
          <button
            onClick={onCartOpen}
            className="p-2 text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:text-black rounded-full relative transition-colors flex items-center justify-center cursor-pointer"
            title="Ver carrito"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-zinc-950 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold font-sans">
                {cartCount}
              </span>
            )}
          </button>
 
          {/* Mobile Menu Toggle */}
          <button
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full md:hidden transition-colors flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm font-semibold text-gray-500 shadow-lg absolute w-full left-0 z-30">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (view !== 'home') {
                setView('home');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`text-left py-2 border-b border-gray-50 hover:text-black transition-colors ${isInicioActive ? 'text-black font-extrabold font-sans' : ''}`}
          >
            Inicio
          </button>
          <button
            onClick={() => {
              setView('catalog');
              setMobileMenuOpen(false);
            }}
            className={`text-left py-2 border-b border-gray-50 hover:text-black transition-colors ${isCatalogActive ? 'text-black font-extrabold font-sans' : ''}`}
          >
            Catálogo
          </button>
          <button
            onClick={() => {
              setView('howtobuy');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-left py-2 border-b border-gray-50 hover:text-black transition-colors ${isHowToBuyActive ? 'text-black font-extrabold font-sans' : ''}`}
          >
            ¿Cómo comprar?
          </button>
          <button
            onClick={() => {
              setView('contact');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-left py-2 border-b border-gray-50 hover:text-black transition-colors ${isContactActive ? 'text-black font-extrabold font-sans' : ''}`}
          >
            Contacto
          </button>
        </div>
      )}
    </header>
  );
}
