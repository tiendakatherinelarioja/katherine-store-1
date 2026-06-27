import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import ProductCard from '../../components/product/ProductCard';
import { ChevronRight, Megaphone, Tag, Award } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// New Home Components
import HeroSection from '../../components/home/HeroSection';
import CategoryMasonry from '../../components/home/CategoryMasonry';
import ServiceHighlights from '../../components/home/ServiceHighlights';

export default function Home({ products }) {
  const { setView, setCategoryFilter } = useCart();
  const { announcements } = useAnnouncements();

  // Announcements Banner States
  const [currentAnnIndex, setCurrentAnnIndex] = useState(0);
  const activeAnnouncements = announcements.filter(ann => ann.activo);

  // Auto-slide Announcements
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const annTimer = setInterval(() => {
      setCurrentAnnIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4500);
    return () => clearInterval(annTimer);
  }, [activeAnnouncements.length]);

  const navigateToCatalog = (categoryName = 'Todos') => {
    setCategoryFilter(categoryName);
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch sales counts for dynamic Best Sellers (Destacados)
  const [salesCounts, setSalesCounts] = useState({});

  useEffect(() => {
    const fetchSalesCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('detalles_pedido')
          .select('producto_id, cantidad');
        if (!error && data) {
          const counts = {};
          data.forEach((row) => {
            const pId = row.producto_id;
            counts[pId] = (counts[pId] || 0) + (row.cantidad || 0);
          });
          setSalesCounts(counts);
        }
      } catch (err) {
        console.error('Error fetching sales counts:', err);
      }
    };
    fetchSalesCounts();
  }, []);

  // Filter products for Promotions & Featured
  const promoProducts = React.useMemo(() => {
    const list = products.filter((p) => p.stock > 0 && p.activo !== false && p.relevante === true);
    if (list.length > 0) return list;

    // Fallback search in names/descriptions
    const fallbackList = products.filter(
      (p) =>
        p.stock > 0 &&
        p.activo !== false &&
        ['promo', 'oferta', 'descuento'].some(term =>
          (p.name || '').toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term)
        )
    );
    if (fallbackList.length > 0) return fallbackList.slice(0, 4);
    return products.filter((p) => p.stock > 0 && p.activo !== false).slice(0, 4);
  }, [products]);

  const featuredProducts = React.useMemo(() => {
    return [...products]
      .filter((p) => p.stock > 0 && p.activo !== false)
      .sort((a, b) => {
        const salesA = salesCounts[a.id] || 0;
        const salesB = salesCounts[b.id] || 0;
        if (salesB !== salesA) return salesB - salesA;
        return b.rating - a.rating;
      })
      .slice(0, 4);
  }, [products, salesCounts]);

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="flex flex-col bg-white">

      {/* 1. Hero Section - Premium Split Layout */}
      <HeroSection onExplore={navigateToCatalog} />

      {/* 2. Announcement Banner — full-width strip below Hero */}
      {activeAnnouncements.length > 0 && (
        <div className="w-full bg-charcoal border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-center gap-6 min-h-[52px]">

            {/* Dot indicators (when multiple announcements) */}
            {activeAnnouncements.length > 1 && (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {activeAnnouncements.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentAnnIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentAnnIndex ? 'bg-gold w-4' : 'bg-alabaster/20 hover:bg-alabaster/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Announcement text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAnnIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="flex items-center justify-center gap-2.5"
              >
                <Megaphone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[12px] font-semibold text-alabaster/90 tracking-wide">
                  {activeAnnouncements[currentAnnIndex].texto}
                </span>
                {activeAnnouncements[currentAnnIndex].link &&
                  activeAnnouncements[currentAnnIndex].link !== '#' && (
                  <button
                    onClick={() => {
                      if (activeAnnouncements[currentAnnIndex].link.startsWith('http')) {
                        window.open(activeAnnouncements[currentAnnIndex].link, '_blank');
                      } else {
                        navigateToCatalog('Todos');
                      }
                    }}
                    className="text-[11px] font-bold text-gold border-b border-gold/40 hover:border-gold pb-px transition-colors cursor-pointer shrink-0"
                  >
                    Ver más →
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows (when multiple) */}
            {activeAnnouncements.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setCurrentAnnIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-alabaster/30 hover:text-alabaster hover:bg-white/10 transition-all cursor-pointer text-xs"
                >‹</button>
                <button
                  onClick={() => setCurrentAnnIndex((prev) => (prev + 1) % activeAnnouncements.length)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-alabaster/30 hover:text-alabaster hover:bg-white/10 transition-all cursor-pointer text-xs"
                >›</button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* 3. Category Section - Asymmetric Grid */}
      <CategoryMasonry onExplore={navigateToCatalog} />

      {/* 4. Separador */}
      <div className="w-full border-t border-gray-200" />

      {/* 5. Promotions Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <Tag className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold text-taupe uppercase tracking-[0.4em] block">Nuestra Selección</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-jakarta font-medium text-charcoal tracking-tighter"
            >
              Productos en <span className="text-gray-300">promocion.</span>
            </motion.h2>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigateToCatalog('Todos')}
            className="group flex items-center gap-2 text-xs font-bold text-charcoal hover:text-taupe transition-colors cursor-pointer border-b border-transparent hover:border-taupe pb-1"
          >
            Ver Catálogo Completo
            <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {promoProducts.length === 0 ? (
          <div className="text-center py-20 bg-alabaster rounded-[2rem] border border-gray-100">
            <Tag className="w-10 h-10 mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-400">No hay promociones activas en este momento</p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {promoProducts.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 6. Service Highlights Block */}
      <ServiceHighlights />

      {/* 7. Featured Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6 text-center md:text-left">
          <div className="max-w-lg mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center md:justify-start gap-3 mb-4"
            >
              <Award className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold text-taupe uppercase tracking-[0.4em] block">Favoritos de la Comunidad</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-jakarta font-medium text-charcoal tracking-tighter"
            >
              Nuestros <span className="text-gray-300">Más Vendidos.</span>
            </motion.h2>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-alabaster rounded-[2rem] border border-gray-100">
            <Award className="w-10 h-10 mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-400">Cargando destacados...</p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

    </div>
  );
}
