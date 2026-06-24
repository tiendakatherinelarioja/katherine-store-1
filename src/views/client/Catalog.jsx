import React, { useState, useMemo, useEffect } from 'react';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Catalog({ products }) {
  const { categoryFilter, setCategoryFilter } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(true);
  const { categories: dbCategories } = useCategories();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchTerm]);

  // Load categories dynamically from DB hook
  const categories = useMemo(() => {
    return ['Todos', ...dbCategories];
  }, [dbCategories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.activo !== false);

    // Filter by Category
    if (categoryFilter !== 'Todos') {
      const lowerFilter = categoryFilter.toLowerCase();
      if (lowerFilter === 'estética') {
        result = result.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          return cat === 'maquillaje' || cat === 'manicura';
        });
      } else if (lowerFilter === 'moda' || lowerFilter === 'ropa y accesorios') {
        result = result.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          return cat === 'ropa' || cat === 'accesorios';
        });
      } else if (lowerFilter === 'otros') {
        result = result.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          return cat !== 'maquillaje' && cat !== 'manicura' && cat !== 'ropa' && cat !== 'accesorios';
        });
      } else {
        result = result.filter((p) => (p.category || '').toLowerCase() === lowerFilter);
      }
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // Sort Products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, categoryFilter, searchTerm, sortBy]);

  // Paginate list
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, startIndex]);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-taupe" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-taupe">
                Catálogo
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-jakarta font-medium text-charcoal tracking-tighter leading-tight">
                  Nuestros Productos.
                </h1>
                <p className="mt-3 text-sm text-gray-400 font-sans max-w-md leading-relaxed">
                  Explorá nuestra selección de cosméticos, manicura y accesorios. Filtrá por categoría o buscá lo que necesitás.
                </p>
              </div>

              {/* Filter toggle + results count */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] font-semibold text-gray-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                </span>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    showFilters
                      ? 'bg-charcoal text-alabaster border-charcoal'
                      : 'bg-white text-charcoal border-gray-200 hover:border-charcoal'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filtros
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <ProductFilters
              selectedCategory={categoryFilter}
              onCategoryChange={setCategoryFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              categories={categories}
            />
          </motion.div>
        )}

        {/* Result meta row */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {filteredProducts.length === 0
              ? 'Sin resultados'
              : `Mostrando ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filteredProducts.length)} de ${filteredProducts.length}`}
          </span>
          {categoryFilter !== 'Todos' && (
            <button
              onClick={() => setCategoryFilter('Todos')}
              className="text-[11px] font-bold text-taupe hover:text-charcoal transition-colors cursor-pointer border-b border-taupe/40 hover:border-charcoal pb-px"
            >
              Limpiar filtro ×
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-5xl mb-6">🔍</p>
            <h3 className="text-xl font-jakarta font-medium text-charcoal mb-2">Sin resultados</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-sm">
              No encontramos productos que coincidan con tu búsqueda. Probá con otros filtros.
            </p>
            <button
              onClick={() => { setCategoryFilter('Todos'); setSearchTerm(''); }}
              className="px-6 py-3 bg-charcoal text-alabaster text-xs font-bold rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <ProductGrid products={paginatedProducts} />
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                currentPage === 1
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-charcoal hover:bg-charcoal hover:text-alabaster hover:border-charcoal'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  page === currentPage
                    ? 'bg-charcoal text-alabaster border-charcoal'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-charcoal hover:text-charcoal'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                currentPage === totalPages
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-charcoal hover:bg-charcoal hover:text-alabaster hover:border-charcoal'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
