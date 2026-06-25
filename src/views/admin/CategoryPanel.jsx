import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Layers, Plus, Edit2, Trash2, Save, X, AlertCircle, Info, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function CategoryPanel({
  products = [],
  categories = [],
  categoriesList = [],
  subcategoriesList = [],
  loadingCategories = false,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
}) {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deletingName, setDeletingName] = useState(null);

  // Subcategories states
  const [expandedCategories, setExpandedCategories] = useState({});
  const [newSubNames, setNewSubNames] = useState({});
  const [editingSubId, setEditingSubId] = useState(null);
  const [editingSubName, setEditingSubName] = useState('');
  const [deletingSub, setDeletingSub] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper to count how many products belong to a specific category
  const getProductCount = (categoryName) => {
    return products.filter(
      (p) => (p.category || '').toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  // Helper to count products belonging to a subcategory
  const getSubcategoryProductCount = (subName) => {
    return products.filter(
      (p) => (p.subcategory || '').toLowerCase() === subName.toLowerCase()
    ).length;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;

    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      alert('Esta categoría ya existe.');
      return;
    }

    addCategory(name);
    setNewCatName('');
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.nombre);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = (oldName) => {
    const name = editingName.trim();
    if (!name) return;

    if (name.toLowerCase() === oldName.toLowerCase()) {
      cancelEdit();
      return;
    }

    if (categories.some((c) => c.toLowerCase() === name.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
      alert('Ya existe otra categoría con ese nombre.');
      return;
    }

    updateCategory(oldName, name);
    cancelEdit();
  };

  const confirmDelete = (name) => {
    setDeletingName(name);
  };

  const handleDelete = () => {
    if (deletingName) {
      deleteCategory(deletingName);
      setDeletingName(null);
    }
  };

  // Subcategories Handlers
  const toggleCategoryExpand = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleAddSub = (e, categoryId) => {
    e.preventDefault();
    const name = (newSubNames[categoryId] || '').trim();
    if (!name) return;

    const existing = subcategoriesList.find(
      (s) => s.categoria_id === categoryId && s.nombre.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      alert('Esta subcategoría ya existe en esta categoría.');
      return;
    }

    addSubcategory(name, categoryId);
    setNewSubNames((prev) => ({ ...prev, [categoryId]: '' }));
  };

  const handleUpdateSub = (sub) => {
    const name = editingSubName.trim();
    if (!name) return;
    if (name.toLowerCase() === sub.nombre.toLowerCase()) {
      setEditingSubId(null);
      setEditingSubName('');
      return;
    }
    updateSubcategory(sub.id, name);
    setEditingSubId(null);
    setEditingSubName('');
  };

  const handleDeleteSub = () => {
    if (deletingSub) {
      deleteSubcategory(deletingSub.id);
      setDeletingSub(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-700" />
          Gestión de Categorías y Subcategorías
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Crea, renombra o elimina categorías y sus respectivas subcategorías para organizar tu catálogo de productos.
        </p>
      </div>

      {/* Row: Add Category Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50/50 p-4 rounded-md border border-gray-150">
        <div className="flex-1 max-w-none sm:max-w-sm">
          <Input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Ej. Estética, Moda, etc."
            className="w-full text-xs py-2 bg-white"
            disabled={loadingCategories}
          />
        </div>
        <Button
          type="submit"
          className="gap-1.5 text-xs py-2 px-4 rounded-md"
          disabled={loadingCategories || !newCatName.trim()}
        >
          <Plus className="w-4 h-4" />
          Agregar Categoría
        </Button>
      </form>

      {/* Warning Alert Banner */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold">Información de Seguridad:</span>
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-600">
            <li>Al **Renombrar** una categoría, todos los productos asociados se actualizarán automáticamente.</li>
            <li>Al **Eliminar** una categoría, todos sus productos asociados serán reasignados a `"otros"`.</li>
            <li>Haz clic en el icono de flecha (`▶` / `▼`) para gestionar las **subcategorías** asociadas a cada categoría principal.</li>
          </ul>
        </div>
      </div>

      {/* Categories List Container */}
      <div className="flex-1 overflow-y-auto">
        {loadingCategories ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-gray-400 font-bold animate-pulse">Cargando categorías...</span>
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-md text-gray-400 text-xs">
            No hay categorías registradas en la tienda.
          </div>
        ) : (() => {
          // Pagination calculations
          const totalPages = Math.ceil(categoriesList.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedCategories = categoriesList.slice(startIndex, startIndex + itemsPerPage);

          return (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold text-xxs uppercase tracking-widest bg-gray-50/80">
                      <th className="p-3.5 pl-4 rounded-l-md">Nombre de Categoría</th>
                      <th className="p-3.5 text-center">Productos Vinculados</th>
                      <th className="p-3.5 rounded-r-md text-right pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {paginatedCategories.map((cat) => {
                    const count = getProductCount(cat.nombre);
                    const isEditing = editingId === cat.id;
                    const isExpanded = !!expandedCategories[cat.id];
                    const subs = subcategoriesList.filter(s => s.categoria_id === cat.id);

                    return (
                      <React.Fragment key={cat.id}>
                        {/* Fila Principal de Categoría */}
                        <tr className="hover:bg-gray-50/40 transition-colors">
                          
                          {/* Category Name Column */}
                          <td className="p-3.5 pl-4 font-bold text-gray-800">
                            <div className="flex items-center gap-2">
                              {!isEditing && (
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryExpand(cat.id)}
                                  className="p-1 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-md transition-all cursor-pointer"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                              {isEditing ? (
                                <div className="flex items-center gap-2 max-w-xs">
                                  <Input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="py-1 px-2.5 text-xs bg-white"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <span 
                                  className="cursor-pointer hover:text-charcoal transition-colors select-none"
                                  onClick={() => toggleCategoryExpand(cat.id)}
                                >
                                  {cat.nombre}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Associated Products Count Column */}
                          <td className="p-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xxs ${
                              count > 0 
                                ? 'bg-green-50 text-green-700 border border-green-100' 
                                : 'bg-gray-50 text-gray-400 border border-gray-100'
                            }`}>
                              {count} {count === 1 ? 'producto' : 'productos'}
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td className="p-3.5 text-right pr-4">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdate(cat.nombre)}
                                  className="p-1.5 bg-green-50 text-green-600 rounded-md border border-green-150 hover:bg-green-100 transition-colors cursor-pointer"
                                  title="Guardar nombre"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1.5 bg-gray-50 text-gray-500 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                  title="Cancelar edición"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-1.5 bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-colors cursor-pointer"
                                  title="Editar Categoría"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => confirmDelete(cat.nombre)}
                                  className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-md transition-colors cursor-pointer"
                                  title="Eliminar Categoría"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                        </tr>

                        {/* Fila Desplegable para Subcategorías */}
                        {isExpanded && (
                          <tr className="bg-gray-50/40">
                            <td colSpan="3" className="p-4 pl-12 border-b border-gray-150 text-left">
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                  Subcategorías de <strong className="text-gray-650">{cat.nombre}</strong> ({subs.length})
                                </h4>
                                
                                {/* Formulario para agregar subcategoría */}
                                <form 
                                  onSubmit={(e) => handleAddSub(e, cat.id)} 
                                  className="flex gap-2 max-w-sm"
                                >
                                  <Input
                                    type="text"
                                    value={newSubNames[cat.id] || ''}
                                    onChange={(e) => setNewSubNames(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                    placeholder="Ej. Labiales, Esmaltes, Accesorios..."
                                    className="py-1 px-3 text-xs bg-white flex-1"
                                  />
                                  <Button 
                                    type="submit" 
                                    className="py-1 px-4 text-xs rounded-lg shrink-0"
                                    disabled={!(newSubNames[cat.id] || '').trim()}
                                  >
                                    Agregar
                                  </Button>
                                </form>

                                {/* Listado de Subcategorías */}
                                {subs.length === 0 ? (
                                  <p className="text-xxs text-gray-400 italic">No hay subcategorías registradas.</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-w-3xl">
                                    {subs.map((sub) => {
                                      const subCount = getSubcategoryProductCount(sub.nombre);
                                      const isEditingSub = editingSubId === sub.id;

                                      return (
                                        <div 
                                          key={sub.id} 
                                          className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl text-xs hover:border-gray-300 transition-colors shadow-xs"
                                        >
                                          {isEditingSub ? (
                                            <div className="flex items-center gap-1.5 flex-1 mr-2">
                                              <Input
                                                type="text"
                                                value={editingSubName}
                                                onChange={(e) => setEditingSubName(e.target.value)}
                                                className="py-0.5 px-2 text-xs bg-white flex-1"
                                                autoFocus
                                              />
                                              <button
                                                onClick={() => handleUpdateSub(sub)}
                                                className="p-1 bg-green-50 text-green-600 rounded border border-green-150 hover:bg-green-100 transition-colors cursor-pointer"
                                                title="Guardar"
                                              >
                                                <Save className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() => setEditingSubId(null)}
                                                className="p-1 bg-gray-50 text-gray-500 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                                title="Cancelar"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-gray-800">{sub.nombre}</span>
                                              <span className="text-[9px] text-gray-450 font-bold bg-gray-50 px-1.5 py-0.2 border border-gray-150 rounded-full">
                                                {subCount} prod.
                                              </span>
                                            </div>
                                          )}

                                          {!isEditingSub && (
                                            <div className="flex gap-1 shrink-0">
                                              <button
                                                onClick={() => {
                                                  setEditingSubId(sub.id);
                                                  setEditingSubName(sub.nombre);
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-50 border border-gray-150 hover:border-gray-250 rounded transition-colors cursor-pointer"
                                                title="Renombrar subcategoría"
                                              >
                                                <Edit2 className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() => setDeletingSub(sub)}
                                                className="p-1 text-red-400 hover:text-red-650 hover:bg-red-50 border border-red-100 rounded transition-colors cursor-pointer"
                                                title="Eliminar subcategoría"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 shrink-0">
                  <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">
                    Página {currentPage} de {totalPages} ({categoriesList.length} categorías)
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-1.5 border rounded-lg transition-colors cursor-pointer bg-white ${
                        currentPage === 1
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                          : 'border-gray-250 text-gray-655 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-1.5 border rounded-lg transition-colors cursor-pointer bg-white ${
                        currentPage === totalPages
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                          : 'border-gray-250 text-gray-655 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Delete Category Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingName}
        onClose={() => setDeletingName(null)}
        onConfirm={handleDelete}
        title="¿Confirmar Eliminación?"
        description={`¿Estás seguro de que deseas eliminar la categoría "${deletingName}"? Si hay productos pertenecientes a esta categoría, se reasignarán a "otros" automáticamente.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Delete Subcategory Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingSub}
        onClose={() => setDeletingSub(null)}
        onConfirm={handleDeleteSub}
        title="¿Eliminar Subcategoría?"
        description={`¿Estás seguro de que deseas eliminar la subcategoría "${deletingSub?.nombre}"? Esta acción no eliminará los productos, pero removerá esta subcategoría de ellos.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
