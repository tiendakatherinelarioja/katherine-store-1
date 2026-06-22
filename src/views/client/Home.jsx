import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import ProductCard from '../../components/product/ProductCard';
import { ChevronLeft, ChevronRight, Megaphone, ArrowRight, Sparkles, Tag, Gift, Award, Globe, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function Home({ products }) {
  const { setView, setCategoryFilter } = useCart();
  const { announcements, loading: loadingAnnouncements } = useAnnouncements();
  
  const [selectedExploreTab, setSelectedExploreTab] = useState('Todos');
  
  // Hero Carousel States
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: '/slides/makeup_hero.png',
      subtitle: 'En esta temporada, encuentra lo mejor 🔥',
      title: 'Cosméticos & Maquillaje',
      desc: 'Resalta tu belleza natural. Descubre nuestra colección exclusiva de labiales, bases y sombras de alta calidad.',
      category: 'Maquillaje'
    },
    {
      image: '/slides/manicure_hero.png',
      subtitle: 'Uñas impecables y profesionales ✨',
      title: 'Manicura & Nail Art',
      desc: 'Luce unas manos perfectas. Esmaltes semipermanentes, cabinas y accesorios para manicura profesional en casa.',
      category: 'Manicura'
    },
    {
      image: '/slides/fashion_hero.png',
      subtitle: 'Tu estilo, tu personalidad 💫',
      title: 'Ropa & Accesorios',
      desc: 'El complemento ideal para tu look. Carteras exclusivas, anteojos de sol, termos premium y bijouterie de diseño.',
      category: 'Ropa y Accesorios'
    }
  ];

  // Announcements Banner States
  const [currentAnnIndex, setCurrentAnnIndex] = useState(0);
  const activeAnnouncements = announcements.filter(ann => ann.activo);

  // Auto-slide Hero Carousel
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
  // 1. Promotions: explicitly marked as relevante = true. Fallback: text matching & stock
  const promoProducts = React.useMemo(() => {
    const list = products.filter((p) => p.stock > 0 && p.activo !== false && p.relevante === true);
    if (list.length > 0) return list;
    
    // Fallback
    const fallbackList = products.filter(
      (p) =>
        p.stock > 0 &&
        p.activo !== false &&
        ((p.description || '').toLowerCase().includes('promo') ||
          (p.name || '').toLowerCase().includes('promo') ||
          (p.description || '').toLowerCase().includes('oferta') ||
          (p.name || '').toLowerCase().includes('oferta') ||
          (p.description || '').toLowerCase().includes('descuento') ||
          (p.name || '').toLowerCase().includes('descuento'))
    );
    if (fallbackList.length > 0) return fallbackList.slice(0, 4);
    return products.filter((p) => p.stock > 0 && p.activo !== false).slice(0, 4);
  }, [products]);

  // 2. Featured: products in stock sorted by units sold, fallback to rating
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

  return (
    <div className="flex flex-col gap-12 pb-24 bg-gray-50/30">
      
      {/* 1. HeroSection: Sliding Carousel */}
      <section className="w-full">
        <div className="relative bg-[#F9F6F0] overflow-hidden h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] w-full flex items-center group/hero">
          
          {/* Slides Container */}
          <div className="w-full h-full relative">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                    isActive 
                      ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                      : 'opacity-0 scale-95 pointer-events-none z-0'
                  }`}
                >
                  <img
                    alt={slide.title}
                    className="w-full h-full object-cover select-none"
                    src={slide.image}
                  />
                </div>
              );
            })}
          </div>

          {/* Side Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-sm border border-gray-100 hover:scale-105 transition-all z-20 cursor-pointer opacity-0 group-hover/hero:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-sm border border-gray-100 hover:scale-105 transition-all z-20 cursor-pointer opacity-0 group-hover/hero:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Dots indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 2. Announcement Section: Personalizable announcements managed from dashboard */}
      {activeAnnouncements.length > 0 && (
        <section className="w-full">
          <div className="bg-zinc-100 border-y border-zinc-200 py-3 px-6 shadow-none">
            <div className="flex items-center justify-center gap-3 min-h-[28px] overflow-hidden relative">
              {activeAnnouncements.map((ann, idx) => {
                const isActive = idx === currentAnnIndex;
                return (
                  <div
                    key={ann.id}
                    className={`absolute flex items-center justify-center gap-2 text-center text-[11px] md:text-xs font-bold text-zinc-800 transition-all duration-500 ${
                      isActive 
                        ? 'opacity-100 translate-y-0 scale-100 z-10' 
                        : 'opacity-0 -translate-y-2 scale-95 pointer-events-none z-0'
                    }`}
                  >
                    <Megaphone className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>{ann.texto}</span>
                    {ann.link && ann.link !== '#' && (
                      <button 
                        onClick={() => {
                          if (ann.link.startsWith('#') || ann.link.startsWith('/')) {
                            navigateToCatalog('Todos');
                          } else {
                            window.open(ann.link, '_blank');
                          }
                        }}
                        className="underline hover:text-black font-black cursor-pointer ml-1"
                      >
                        Ver más
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. CategorySection: Main categories cards with direct access */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col mb-8 text-center md:text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Categorías Principales</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Comienza a explorar. <span className="text-gray-400 font-normal">Encuentra tu estilo ideal</span>
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none justify-start md:justify-center border-b border-gray-100">
          {[
            { name: 'Todos', icon: Globe },
            { name: 'Maquillaje', icon: Sparkles },
            { name: 'Manicura', icon: Award },
            { name: 'Ropa y Accesorios', icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedExploreTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setSelectedExploreTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xs border border-zinc-950'
                    : 'bg-white hover:bg-zinc-50 text-gray-450 hover:text-zinc-800 border border-gray-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Card Grid */}
        <div className={`grid grid-cols-1 ${selectedExploreTab === 'Todos' ? 'sm:grid-cols-2 md:grid-cols-3' : 'max-w-md mx-auto'} gap-6`}>
          {[
            {
              category: 'Maquillaje',
              subtitle: 'Cosmética Profesional',
              title: 'Maquillaje',
              thumbnail: '/slides/makeup.png',
              bgCircle: 'bg-pink-50/50',
              pattern: (
                <svg className="absolute -right-2 -bottom-2 w-32 h-32 text-pink-200/30 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="40" y="30" width="50" height="10" rx="5" />
                  <rect x="25" y="50" width="65" height="10" rx="5" />
                  <rect x="50" y="70" width="40" height="10" rx="5" />
                </svg>
              )
            },
            {
              category: 'Manicura',
              subtitle: 'Uñas impecables',
              title: 'Manicura',
              thumbnail: '/slides/manicure.png',
              bgCircle: 'bg-emerald-50/50',
              pattern: (
                <svg className="absolute -right-2 -bottom-2 w-32 h-32 text-emerald-200/30 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 70 L40 50 L60 70 L80 50 L100 70" />
                  <path d="M35 85 L55 65 L75 85 L95 65" />
                </svg>
              )
            },
            {
              category: 'Ropa y Accesorios',
              subtitle: 'Moda y complementos',
              title: 'Ropa & Accesorios',
              thumbnail: '/slides/fashion.png',
              bgCircle: 'bg-blue-50/50',
              pattern: (
                <svg className="absolute -right-2 -bottom-2 w-32 h-32 text-blue-200/30 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="6" />
                  <circle cx="75" cy="50" r="6" />
                  <circle cx="50" cy="75" r="6" />
                  <circle cx="75" cy="75" r="6" />
                  <circle cx="25" cy="50" r="6" />
                  <circle cx="25" cy="75" r="6" />
                  <circle cx="50" cy="25" r="6" />
                  <circle cx="75" cy="25" r="6" />
                  <circle cx="25" cy="25" r="6" />
                </svg>
              )
            }
          ]
            .filter((card) => selectedExploreTab === 'Todos' || card.category === selectedExploreTab)
            .map((card) => {
              const getCount = (catName) => {
                if (!products || !Array.isArray(products)) return 0;
                if (catName === 'Ropa y Accesorios') {
                  return products.filter((p) => {
                    const cat = (p.category || '').toLowerCase();
                    return cat === 'ropa' || cat === 'accesorios';
                  }).length;
                }
                return products.filter((p) => (p.category || '').toLowerCase() === catName.toLowerCase()).length;
              };
              const count = getCount(card.category);
              return (
                <div
                  key={card.category}
                  onClick={() => navigateToCatalog(card.category)}
                  className="group relative border border-gray-200/75 rounded-2xl bg-white p-6 h-56 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-zinc-800/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left"
                >
                  {/* Upper row */}
                  <div className="flex items-center justify-between z-10">
                    <div className={`w-12 h-12 rounded-full ${card.bgCircle} border border-gray-100 flex items-center justify-center overflow-hidden shrink-0`}>
                      <img 
                        src={card.thumbnail} 
                        alt={card.title} 
                        className="w-8 h-8 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Background Pattern */}
                  {card.pattern}

                  {/* Lower row */}
                  <div className="z-10 mt-auto">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      {card.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 block">
                      {card.title}
                    </h3>
                    <span className="text-xs text-zinc-500 mt-1 inline-block font-medium">
                      {count} {count === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 4. On-sale/Promotions Section: products in stock with "promocion" tags or fallbacks */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Precios Especiales</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-900" />
              Promociones Especiales
            </h2>
          </div>
          <button 
            onClick={() => navigateToCatalog('Todos')}
            className="text-xs font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            Ver todo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {promoProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 text-gray-400">
            <Tag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-bold">No hay promociones disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {promoProducts.map((product) => (
              <div key={product.id} className="relative">
                <span className="absolute top-3 left-3 bg-zinc-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm z-20 uppercase tracking-wider">
                  Promoción
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Featured Section: high rated products */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Lo Más Valorado</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-900" />
              Destacados
            </h2>
          </div>
          <button 
            onClick={() => navigateToCatalog('Todos')}
            className="text-xs font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            Ver todo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 text-gray-400">
            <Award className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-bold">Cargando productos destacados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Highlight Banners for the 3 main categories */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Highlight Card 1 */}
          <div className="bg-zinc-50 border border-zinc-200/85 rounded-3xl p-8 flex flex-col justify-between h-72 relative overflow-hidden group">
            <div className="z-10 text-left">
              <span className="text-[9px] font-bold text-zinc-650 bg-white border border-zinc-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Tendencias</span>
              <h3 className="text-2xl font-bold mt-3 text-gray-900">Look Perfecto</h3>
              <p className="text-[11px] text-gray-500 mt-2 max-w-[170px] leading-relaxed">Labiales mate y esmaltes seleccionados para combinar.</p>
            </div>
            <button 
              onClick={() => navigateToCatalog('Maquillaje')}
              className="bg-zinc-950 text-white hover:bg-black rounded-full px-5 py-2 text-[10px] font-bold w-max transition-all z-10 cursor-pointer active:scale-95 shadow-sm"
            >
              Ver Colección
            </button>
            <img 
              alt="Highlight 1" 
              className="w-36 h-36 object-contain absolute right-[-10px] bottom-[-10px] group-hover:scale-105 transition-transform duration-300" 
              src="/slides/makeup.png"
            />
          </div>

          {/* Highlight Card 2 */}
          <div className="bg-zinc-50 border border-zinc-200/85 rounded-3xl p-8 flex flex-col justify-between h-72 relative overflow-hidden group">
            <div className="z-10 text-left">
              <span className="text-[9px] font-bold text-zinc-650 bg-white border border-zinc-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Nail Art</span>
              <h3 className="text-2xl font-bold mt-3 text-gray-900">Uñas Premium</h3>
              <p className="text-[11px] text-gray-500 mt-2 max-w-[170px] leading-relaxed">Esmaltes duraderos e insumos para lucir manicura de salón.</p>
            </div>
            <button 
              onClick={() => navigateToCatalog('Manicura')}
              className="bg-zinc-950 text-white hover:bg-black rounded-full px-5 py-2 text-[10px] font-bold w-max transition-all z-10 cursor-pointer active:scale-95 shadow-sm"
            >
              Ver Todo
            </button>
            <img 
              alt="Highlight 2" 
              className="w-36 h-36 object-contain absolute right-[-10px] bottom-[-10px] group-hover:scale-105 transition-transform duration-300" 
              src="/slides/manicure.png"
            />
          </div>

          {/* Highlight Card 3 */}
          <div className="bg-zinc-50 border border-zinc-200/85 rounded-3xl p-8 flex flex-col justify-between h-72 relative overflow-hidden group">
            <div className="z-10 text-left">
              <span className="text-[9px] font-bold text-zinc-650 bg-white border border-zinc-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Accesorios</span>
              <h3 className="text-2xl font-bold mt-3 text-gray-900">Termos &amp; Moda</h3>
              <p className="text-[11px] text-gray-500 mt-2 max-w-[170px] leading-relaxed">Termos premium de alta conservación y bijouterie chic.</p>
            </div>
            <button 
              onClick={() => navigateToCatalog('Ropa y Accesorios')}
              className="bg-zinc-950 text-white hover:bg-black rounded-full px-5 py-2 text-[10px] font-bold w-max transition-all z-10 cursor-pointer active:scale-95 shadow-sm"
            >
              Comprar
            </button>
            <img 
              alt="Highlight 3" 
              className="w-36 h-36 object-contain absolute right-[-10px] bottom-[-10px] group-hover:scale-105 transition-transform duration-300" 
              src="/slides/fashion.png"
            />
          </div>

        </div>
      </section>

    </div>
  );
}
