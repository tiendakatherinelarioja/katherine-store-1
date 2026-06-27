import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection({ onExplore }) {
  const [isDesktop, setIsDesktop] = useState(false);

  // Check screen width on mount and resize
  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const { scrollYProgress } = useScroll();
  
  // Parallax transform calculations (only active and updated on desktop to save mobile CPU)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -150 : 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -300 : 0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? -80 : 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden bg-alabaster">
      {/* Left Content - Editorial Text */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start px-8 sm:px-12 md:px-20 py-28 lg:py-0 z-20 min-h-screen lg:min-h-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-10 h-[1px] bg-taupe" />
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-taupe">
              Nuestras selecciones para vos
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-jakarta font-medium text-charcoal leading-[0.85] tracking-tighter mb-10">
            Conoce <br />
            <span className="italic font-light text-taupe">nuestros </span> Productos.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-gray-500 font-sans leading-relaxed mb-12 max-w-sm">
            Explora por nuestro catalogo la variedad de productos para vos o tu emprendimiento!.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <Button 
              onClick={() => onExplore('Todos')}
              className="px-10 py-5 bg-charcoal text-alabaster rounded-none hover:bg-black transition-all-custom shadow-xl shadow-charcoal/10"
            >
              Explorar Catálogo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <button 
              onClick={() => onExplore('Maquillaje')}
              className="group text-sm font-bold flex items-center gap-2 py-2 cursor-pointer bg-transparent border-0"
            >
              <span className="border-b-2 border-transparent group-hover:border-charcoal transition-all">Ver Novedades</span>
              <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Content - Parallax Imagery Grid (Completely omitted on mobile to prevent download) */}
      {isDesktop && (
        <div className="lg:w-1/2 relative lg:h-auto overflow-hidden bg-white/30">
          <div className="absolute inset-0 grid grid-cols-2 gap-6 p-6 lg:p-12">
            <div className="flex flex-col gap-6">
              <motion.div 
                style={{ y: y1 }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              >
                <img src="/slides/makeup_hero.png" alt="Makeup" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/5" />
              </motion.div>
              <motion.div 
                style={{ y: y3 }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="h-[300px] rounded-[2.5rem] overflow-hidden shadow-xl relative"
              >
                <img src="/slides/fashion_hero.png" alt="Accessories" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/5" />
              </motion.div>
            </div>
            <div className="flex flex-col gap-6 pt-24">
              <motion.div 
                style={{ y: y2 }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              >
                <img src="/slides/manicure_hero.png" alt="Manicure" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/5" />
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-dusty-rose/10 rounded-full blur-[100px] z-0" />
          <div className="absolute bottom-1/4 -left-10 w-64 h-64 bg-gold/10 rounded-full blur-[80px] z-0" />
        </div>
      )}
    </section>
  );
}
