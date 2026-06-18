import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.mensaje) return;
    setSubmitted(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 font-sans text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* Left Column: Spacing & Details */}
        <div className="space-y-10 text-left">
          {/* Main Title */}
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
              Contacto
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              ¿Tienes alguna duda sobre nuestros productos, envíos o showroom? Escríbenos o visítanos.
            </p>
          </div>

          {/* Details list */}
          <div className="space-y-8 pt-4">
            
            {/* Address */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-900" />
                Dirección
              </span>
              <p className="text-sm text-gray-500 leading-relaxed pl-6 max-w-md">
                Buenos Aires, Argentina. Showroom y retiros coordinados con cita previa.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-900" />
                Correo Electrónico
              </span>
              <p className="text-sm text-gray-500 pl-6">
                <a href="mailto:hola@katherine.com" className="hover:text-black hover:underline transition-colors">
                  hola@katherine.com
                </a>
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-900" />
                Teléfono / WhatsApp
              </span>
              <p className="text-sm text-gray-500 pl-6">
                <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition-colors font-medium">
                  +54 9 11 0000-0000
                </a>
              </p>
            </div>

            {/* Socials */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-900" />
                Redes Sociales
              </span>
              
              {/* Minimal social icons in row */}
              <div className="flex items-center gap-3 pl-6">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Instagram"
                >
                  <svg className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="https://telegram.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Telegram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.59-3.27 3.61-1.5 4.36-1.76 4.85-1.77.11 0 .35.03.51.16.13.12.17.28.19.39.02.09.02.21-.01.32z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Spacing & Form */}
        <div className="text-left space-y-6">
          {submitted && (
            <div className="bg-green-50/70 border border-green-150 p-4 rounded-xl flex items-start gap-3 text-green-800 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs block">¡Mensaje enviado!</span>
                <p className="text-[11px] text-green-700 mt-0.5 leading-relaxed">
                  Gracias por escribirnos. Responderemos tu consulta a la brevedad.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Nombre completo</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: María Pérez"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all placeholder-gray-400 font-medium"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Dirección de correo electrónico</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="maria@ejemplo.com"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all placeholder-gray-400 font-medium"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Mensaje</label>
              <textarea
                rows="5"
                required
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                placeholder="Escribe aquí tu consulta..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all placeholder-gray-400 resize-none font-medium"
              />
            </div>

            {/* Submit Button (Black Pill) */}
            <button
              type="submit"
              className="bg-zinc-950 text-white hover:bg-black rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm hover:shadow-md cursor-pointer block"
            >
              Enviar mensaje
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
