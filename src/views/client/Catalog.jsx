import React, { useState, useMemo, useEffect } from 'react';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';

export default function Catalog({ products }) {
  const { categoryFilter, setCategoryFilter } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const { categories: dbCategories } = useCategories();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pb-20">
      {/* Title Header */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Catálogo de Productos</h1>
        <p className="text-gray-500 text-sm max-w-lg">
          Explora nuestra colección de maquillaje, manicura, accesorios y termos. Agrega al carrito y concreta tu pedido al instante.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <ProductFilters
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        categories={categories}
      />

      {/* Search results text */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
        </span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={paginatedProducts} />

      {/* Pagination UI Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-8">
          <span className="text-xxs font-bold text-gray-400 uppercase tracking-widest">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                currentPage === 1
                  ? 'border-gray-150 text-gray-300 cursor-not-allowed'
                  : 'bg-white border-gray-250 text-gray-500 hover:text-black hover:bg-gray-50/50'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
                currentPage === totalPages
                  ? 'border-gray-150 text-gray-300 cursor-not-allowed'
                  : 'bg-white border-gray-250 text-gray-500 hover:text-black hover:bg-gray-50/50'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
