import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Maquillaje',
    image: 'https://images.pexels.com/photos/6167442/pexels-photo-6167442.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Explorá colores vibrantes'
  },
  {
    name: 'Manicura',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?crop=entropy&cs=srgb&fm=jpg&q=80&w=600',
    desc: 'Cuidado profesional para tus manos'
  },
  {
    name: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1577909687863-91bb3ec12db5?crop=entropy&cs=srgb&fm=jpg&q=80&w=600',
    desc: 'El toque final para tu outfit'
  }
];

export default function CategoryMasonry({ onExplore }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-xl">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[1px] bg-taupe" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-taupe">Categorías</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-jakarta font-medium text-charcoal tracking-tighter leading-tight"
          >
            Busca por nuestra web las diferentes categorías. <br />
            <span className="text-gray-300"></span>
          </motion.h2>
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          onClick={() => onExplore('Todos')}
          className="text-sm font-bold border-b-2 border-charcoal pb-1 hover:text-taupe hover:border-taupe transition-all duration-300 cursor-pointer bg-transparent border-t-0 border-x-0"
        >
          Ver todo el catálogo
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[700px]">
        {/* Featured Large Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 lg:col-span-8 relative rounded-[2.5rem] overflow-hidden group cursor-pointer h-[400px] md:h-full"
          onClick={() => onExplore(categories[0].name)}
        >
          <img 
            src={categories[0].image} 
            alt={categories[0].name}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-102"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="absolute bottom-12 left-12 text-white max-w-sm">
            <h3 className="text-4xl font-jakarta font-medium mb-3">{categories[0].name}</h3>
            <p className="text-sm text-alabaster/80 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              {categories[0].desc} <ArrowRight className="inline ml-2 w-4 h-4" />
            </p>
          </div>
        </motion.div>

        {/* Vertical Stack */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-8 h-full">
          {categories.slice(1).map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + idx * 0.05 }}
              className="flex-1 relative rounded-[2.5rem] overflow-hidden group cursor-pointer min-h-[300px]"
              onClick={() => onExplore(cat.name)}
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/50 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-alabaster p-8 text-center">
                <h3 className="text-3xl font-jakarta font-medium mb-2">{cat.name}</h3>
                <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Explorar Colección
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
