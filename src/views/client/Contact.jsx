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
              ¿Tenes alguna duda sobre nuestros productos, envíos o showroom? Escribinos o visítanos.
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
                La Rioja - Pelagio B. Luna 619. Showroom y retiros.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-900" />
                Correo Electrónico
              </span>
              <p className="text-sm text-gray-500 pl-6">
                <a href="mailto:tiendakatherinelarioja@gmail.com" className="hover:text-black hover:underline transition-colors">
                  tiendakatherinelarioja@gmail.com
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
                <a href="https://wa.me/5493804918672" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition-colors font-medium">
                  +54 9 3804 91-8672
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
                  href="https://www.instagram.com/katherine_larioja/" 
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
