import React from 'react';

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

  // Extract other database subcategories not falling under Estética or Moda
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

  // Handle Level 1 selection
  const handleGeneralSelect = (genName) => {
    if (genName === 'Todos') {
      onCategoryChange('Todos');
    } else if (genName === 'Estética') {
      onCategoryChange('Estética');
    } else if (genName === 'Moda') {
      onCategoryChange('Moda');
    } else {
      onCategoryChange('Otros');
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-50/40 p-5 rounded-2xl border border-gray-200/80 mb-8 text-left">
      
      {/* Nivel 1: Categorías Generales */}
      <div>
        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Categoría General
        </h5>
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Estética', 'Moda', 'Otros'].map((genCat) => {
            const isActive = currentGeneral === genCat;
            return (
              <button
                key={genCat}
                type="button"
                onClick={() => handleGeneralSelect(genCat)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50/50'
                }`}
              >
                {genCat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nivel 2: Subcategorías (Mostrado condicionalmente) */}
      {currentGeneral !== 'Todos' && (
        <div className="bg-gray-100/40 p-3 rounded-2xl border border-gray-200/50 space-y-2.5 animate-fade-in">
          <h6 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">
            Subcategorías de {currentGeneral}
          </h6>
          <div className="flex flex-wrap gap-1.5">
            {/* General selector inside hierarchy */}
            <button
              type="button"
              onClick={() => onCategoryChange(currentGeneral)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 cursor-pointer ${
                selectedCategory.toLowerCase() === currentGeneral.toLowerCase()
                  ? 'bg-zinc-800 border-zinc-800 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50/50'
              }`}
            >
              Todos en {currentGeneral}
            </button>

            {/* Subcategories list */}
            {currentGeneral === 'Estética' &&
              ['Maquillaje', 'Manicura'].map((sub) => {
                const isSelected = selectedCategory.toLowerCase() === sub.toLowerCase();
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => onCategoryChange(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-800 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50/50'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}

            {currentGeneral === 'Moda' &&
              ['Ropa', 'Accesorios'].map((sub) => {
                const isSelected = selectedCategory.toLowerCase() === sub.toLowerCase();
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => onCategoryChange(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-800 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50/50'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}

            {currentGeneral === 'Otros' &&
              otherSubcategories.map((sub) => {
                const isSelected = selectedCategory.toLowerCase() === sub.toLowerCase();
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => onCategoryChange(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-800 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50/50'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Panel de Búsqueda y Ordenamiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search sin lupa */}
        <div className="md:col-span-2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-all placeholder-gray-400 font-medium text-gray-800"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-all appearance-none cursor-pointer text-gray-700 font-medium"
          >
            <option value="relevance">Ordenar por: Relevancia</option>
            <option value="price-asc">Precio: de Menor a Mayor</option>
            <option value="price-desc">Precio: de Mayor a Menor</option>
            <option value="rating">Popularidad (Estrellas)</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
