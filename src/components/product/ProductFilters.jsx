import React from 'react';
import { Search, X } from 'lucide-react';

// Helpers to map database category strings to General Category types
const getGeneralCategory = (cat) => {
  const lower = (cat || '').toLowerCase();
  if (lower === 'todos') return 'Todos';
  if (lower === 'maquillaje' || lower === 'manicura' || lower === 'estética') return 'Estética';
  if (lower === 'ropa' || lower === 'accesorios' || lower === 'ropa y accesorios' || lower === 'moda') return 'Moda';
  return 'Otros';
};

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  categories = []
}) {
  const currentGeneral = getGeneralCategory(selectedCategory);

  // Extract subcategories not falling under Estética or Moda
  const otherSubcategories = categories.filter((cat) => {
    const c = cat.toLowerCase();
    return (
      c !== 'todos' &&
      c !== 'maquillaje' &&
      c !== 'manicura' &&
      c !== 'ropa' &&
      c !== 'accesorios' &&
      c !== 'ropa y accesorios' &&
      c !== 'estética' &&
      c !== 'moda' &&
      c !== 'otros'
    );
  });

  const handleGeneralSelect = (genName) => {
    if (genName === 'Todos') onCategoryChange('Todos');
    else if (genName === 'Estética') onCategoryChange('Estética');
    else if (genName === 'Moda') onCategoryChange('Moda');
    else onCategoryChange('Otros');
  };

  const pillBase = 'px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 active:scale-95 cursor-pointer';
  const pillActive = 'bg-charcoal border-charcoal text-alabaster shadow-sm';
  const pillInactive = 'bg-white border-gray-200 text-gray-500 hover:text-charcoal hover:border-charcoal';

  const subPillBase = 'px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 cursor-pointer';
  const subPillActive = 'bg-charcoal border-charcoal text-alabaster';
  const subPillInactive = 'bg-white border-gray-200 text-gray-500 hover:text-charcoal hover:border-charcoal';

  return (
    <div className="flex flex-col gap-5 text-left">

      {/* Nivel 1: Categorías Generales */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
          Categoría
        </p>
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Estética', 'Moda', 'Otros'].map((genCat) => (
            <button
              key={genCat}
              type="button"
              onClick={() => handleGeneralSelect(genCat)}
              className={`${pillBase} ${currentGeneral === genCat ? pillActive : pillInactive}`}
            >
              {genCat}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel 2: Subcategorías */}
      {currentGeneral !== 'Todos' && (
        <div className="flex flex-wrap gap-2 pl-1 animate-fade-in border-l-2 border-gray-100 ml-1">
          <button
            type="button"
            onClick={() => onCategoryChange(currentGeneral)}
            className={`${subPillBase} ${
              selectedCategory.toLowerCase() === currentGeneral.toLowerCase()
                ? subPillActive
                : subPillInactive
            }`}
          >
            Todos en {currentGeneral}
          </button>

          {currentGeneral === 'Estética' &&
            ['Maquillaje', 'Manicura'].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => onCategoryChange(sub)}
                className={`${subPillBase} ${
                  selectedCategory.toLowerCase() === sub.toLowerCase() ? subPillActive : subPillInactive
                }`}
              >
                {sub}
              </button>
            ))}

          {currentGeneral === 'Moda' &&
            ['Ropa', 'Accesorios'].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => onCategoryChange(sub)}
                className={`${subPillBase} ${
                  selectedCategory.toLowerCase() === sub.toLowerCase() ? subPillActive : subPillInactive
                }`}
              >
                {sub}
              </button>
            ))}

          {currentGeneral === 'Otros' &&
            otherSubcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => onCategoryChange(sub)}
                className={`${subPillBase} ${
                  selectedCategory.toLowerCase() === sub.toLowerCase() ? subPillActive : subPillInactive
                }`}
              >
                {sub}
              </button>
            ))}
        </div>
      )}

      {/* Search + Sort */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal transition-all placeholder-gray-400 font-medium text-charcoal"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal transition-all appearance-none cursor-pointer text-gray-600 font-medium"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Popularidad</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
