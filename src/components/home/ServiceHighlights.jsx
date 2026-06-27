import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, MessageCircle, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Elegí tu producto',
    desc: 'Navegá por el catálogo y seleccioná los productos que querés. Filtrá por categoría para encontrarlos más fácil.',
  },
  {
    icon: ShoppingCart,
    number: '02',
    title: 'Armá tu carrito',
    desc: 'Agregá todos los artículos que quieras al carrito. Podés seguir comprando y volver cuando estés listo.',
  },
  {
    icon: MessageCircle,
    number: '03',
    title: 'Confirmá por WhatsApp',
    desc: 'Al finalizar, te redirigimos a WhatsApp para coordinar el pago (efectivo, transferencia o Mercado Pago) y la entrega.',
  },
  {
    icon: Package,
    number: '04',
    title: 'Recibí tu pedido',
    desc: 'Despachamos en menos de 24hs. También podés pasar a retirar personalmente en nuestro local.',
  },
];

export default function ServiceHighlights() {
  const { setView } = useCart();

  return (
    <section className="relative w-full py-32 bg-alabaster overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-[1px] bg-taupe" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-taupe">Cómo comprar</span>
            <div className="w-8 h-[1px] bg-taupe" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-jakarta font-medium text-charcoal tracking-tighter"
          >
            Simple, rápido y seguro.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm text-gray-500 font-sans leading-relaxed"
          >
            Seguí estos pasos y recibí tus productos en la puerta de tu casa.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[1px] bg-gray-200 z-0" />
              )}

              {/* Icon circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-white border border-gray-150 flex items-center justify-center mb-6 shadow-sm group-hover:bg-charcoal group-hover:border-charcoal transition-all duration-500">
                <step.icon className="w-5 h-5 text-charcoal group-hover:text-white transition-colors duration-500" />
                {/* Step number badge */}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-charcoal text-white text-[9px] font-bold flex items-center justify-center group-hover:bg-taupe transition-colors duration-500">
                  {idx + 1}
                </span>
              </div>

              <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-charcoal mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed max-w-[220px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <button
            onClick={() => { setView('howtobuy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group text-xs font-bold text-charcoal hover:text-taupe transition-colors flex items-center gap-2 border-b border-charcoal hover:border-taupe pb-1 cursor-pointer"
          >
            Ver guía completa paso a paso
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
