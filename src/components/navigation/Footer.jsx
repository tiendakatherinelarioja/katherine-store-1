import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShieldAlert, X } from 'lucide-react';

export default function Footer() {
  const { setView } = useCart();
  const [logoError, setLogoError] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  return (
    <footer className="bg-white border-t border-gray-100 py-12 font-sans text-gray-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Section: Logo & Socials */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <button 
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
          >
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Logo" 
                onError={() => setLogoError(true)} 
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-extrabold text-gray-900 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-zinc-950 inline-block"></span>
                Katherine
              </span>
            )}
          </button>
          
          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/katherine_larioja/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-100 transition-colors"
              title="Instagram"
            >
              <svg className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Center Section: Direct links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-gray-600">
          <button 
            onClick={() => {
              setView('howtobuy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="hover:text-black transition-colors cursor-pointer"
          >
            Guía de Compras
          </button>
          <button 
            onClick={() => {
              setView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="hover:text-black transition-colors cursor-pointer"
          >
            Contacto
          </button>
          <button 
            onClick={() => setIsLegalOpen(true)} 
            className="hover:text-black transition-colors cursor-pointer"
          >
            Legales
          </button>
        </div>

        {/* Right Section: Copyright & credit */}
        <div className="flex flex-col items-center md:items-end gap-1.5 text-gray-400">
          <span>
            © {new Date().getFullYear()} Katherine. Todos los derechos reservados.
          </span>
          <span className="text-[10px] tracking-wide">
            desarrollo por <a href="https://github.com/bronannodev" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-500 hover:text-black hover:underline">bronannodev</a>
          </span>
        </div>

      </div>

      {/* Legales Modal */}
      {isLegalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <ShieldAlert className="w-5 h-5 text-gray-500" />
                <span>Información Legal</span>
              </div>
              <button 
                onClick={() => setIsLegalOpen(false)} 
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-gray-500 text-[11px] leading-relaxed space-y-3 max-h-60 overflow-y-auto pr-1">
              <p className="font-bold text-gray-700">Términos y Condiciones de Compra</p>
              <p>
                Los pedidos realizados a través de este e-commerce representan solicitudes de reserva y compra personalizada. Katherine no procesa pagos automáticos directamente en el sitio web para proteger a los usuarios.
              </p>
              <p>
                Una vez confirmado el formulario de envío/retiro y enviado el detalle por WhatsApp, la transacción y los datos de pago se coordinan directamente con nuestros representantes.
              </p>
              <p className="font-bold text-gray-700">Políticas de Devolución</p>
              <p>
                Por razones de higiene y salud pública, los artículos de maquillaje y manicura abiertos no poseen devolución a menos que presenten fallas de fabricación demostrables al momento de la entrega.
              </p>
            </div>
            <button
              onClick={() => setIsLegalOpen(false)}
              className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors cursor-pointer text-center block text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
