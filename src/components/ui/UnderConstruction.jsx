import React from 'react';
import StarsBackground from './StarsBackground';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnderConstruction({ onAdminLogin }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-950 via-neutral-900 to-indigo-950 text-white font-sans selection:bg-purple-500/30 selection:text-white">
      {/* Stars Canvas Background */}
      <StarsBackground />

      {/* Cosmic Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_75%)] pointer-events-none z-0" />

      {/* Spacer to push content to center */}
      <div className="h-20 w-full" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center space-y-8"
        >
          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white/95 font-jakarta max-w-2xl mx-auto drop-shadow-md">
            Katherine esta praparando algo para vos
          </h1>

          {/* Description Section (Smaller font size) */}
          <div className="space-y-4 pt-2">
            <p className="text-xs md:text-sm text-white/50 font-medium max-w-md mx-auto leading-relaxed uppercase tracking-wider">
              seguinos en nuestras redes para enterarte del lanzamiento!
            </p>
            
            {/* Instagram Link (Smaller descriptive style) */}
            <div className="flex justify-center">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://www.instagram.com/katherine_larioja/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-xs shadow-sm"
              >
                <svg className="w-3.5 h-3.5 shrink-0" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                Instagram
              </motion.a>
            </div>
          </div>

          {/* Admin Access (Discrete) */}
          <div className="pt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdminLogin}
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-[11px]"
            >
              <Lock className="w-3 h-3 shrink-0 text-white/30" />
              Acceso Admin
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-8 text-white/15 text-[10px] tracking-widest font-jakarta uppercase">
        © {new Date().getFullYear()} Todos los derechos reservados.
      </footer>
    </div>
  );
}
