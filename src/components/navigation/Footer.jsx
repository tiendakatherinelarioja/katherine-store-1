import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShieldAlert, X, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { setView } = useCart();
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', action: () => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Catálogo', action: () => setView('catalog') },
    { label: '¿Cómo comprar?', action: () => { setView('howtobuy'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Contacto', action: () => { setView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Mis Pedidos', action: () => setView('myorders') },
    { label: 'Legales', action: () => setIsLegalOpen(true) },
  ];

  return (
    <footer className="bg-charcoal text-alabaster font-sans">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col gap-8">
            <button
              onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center hover:opacity-70 transition-opacity focus:outline-none w-fit"
            >
              <img
                src="/logo.webp"
                alt="Katherine"
                className="h-8 w-auto object-contain"
                width="370"
                height="56"
                loading="lazy"
              />
            </button>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/katherine_larioja/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-xs font-bold text-alabaster/50 hover:text-alabaster transition-colors w-fit"
              title="Instagram"
            >
              <div className="w-8 h-8 rounded-full border border-alabaster/20 flex items-center justify-center group-hover:border-alabaster transition-colors">
                <svg className="w-3.5 h-3.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              @katherine_larioja
            </a>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-alabaster/30">Navegación</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="group text-left text-sm font-medium text-alabaster/60 hover:text-alabaster transition-colors flex items-center gap-2 w-fit cursor-pointer"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </nav>
          </div>

          {/* Service Column */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-alabaster/30">Atención al cliente</h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/5493804918672"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-medium text-alabaster/60 hover:text-alabaster transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-alabaster/20 flex items-center justify-center group-hover:border-alabaster group-hover:bg-alabaster/10 transition-all">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.554 4.126 1.523 5.862L.057 23.5l5.796-1.52A11.951 11.951 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.64-.493-5.17-1.358l-.37-.22-3.44.902.921-3.354-.242-.386A9.937 9.937 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                </div>
                WhatsApp directo
              </a>
              <p className="text-xs text-alabaster/30 max-w-xs leading-relaxed">
                Lunes a Viernes de 9:00 a 20:00 hs. Sábados de 9:00 a 14:00 hs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-alabaster/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-alabaster/30 font-medium">
            © {new Date().getFullYear()} Katherine. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Legales Modal */}
      {isLegalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-charcoal font-bold font-jakarta">
                <ShieldAlert className="w-5 h-5 text-taupe" />
                <span>Información Legal</span>
              </div>
              <button
                onClick={() => setIsLegalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-charcoal transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full h-[1px] bg-gray-100" />
            <div className="text-gray-500 text-xs leading-relaxed space-y-4 max-h-64 overflow-y-auto pr-1">
              <p className="font-bold text-charcoal text-sm">Términos y Condiciones de Compra</p>
              <p>
                Los pedidos realizados a través de este e-commerce representan solicitudes de reserva y compra personalizada. Katherine no procesa pagos automáticos directamente en el sitio web para proteger a los usuarios.
              </p>
              <p>
                Una vez confirmado el formulario de envío/retiro y enviado el detalle por WhatsApp, la transacción y los datos de pago se coordinan directamente con nuestros representantes.
              </p>
              <p className="font-bold text-charcoal text-sm">Políticas de Devolución</p>
              <p>
                Por razones de higiene y salud pública, los artículos de maquillaje y manicura abiertos no poseen devolución a menos que presenten fallas de fabricación demostrables al momento de la entrega.
              </p>
            </div>
            <button
              onClick={() => setIsLegalOpen(false)}
              className="w-full py-3.5 bg-charcoal text-white font-bold rounded-2xl hover:bg-black transition-colors cursor-pointer text-sm"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
