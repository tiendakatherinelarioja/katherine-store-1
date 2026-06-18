import React, { useState, useMemo } from 'react';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../context/CartContext';

export default function Catalog({ products }) {
  const { categoryFilter, setCategoryFilter } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const { categories: dbCategories } = useCategories();

  // Load categories dynamically from DB hook
  const categories = useMemo(() => {
    return ['Todos', ...dbCategories];
  }, [dbCategories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

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
          Mostrando {filteredProducts.length} de {products.length} productos
        </span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
