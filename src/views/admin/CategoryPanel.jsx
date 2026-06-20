import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Layers, Plus, Edit2, Trash2, Save, X, AlertCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryPanel({
  products = [],
  categories = [],
  categoriesList = [],
  loadingCategories = false,
  addCategory,
  updateCategory,
  deleteCategory
}) {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deletingName, setDeletingName] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper to count how many products belong to a specific category
  const getProductCount = (categoryName) => {
    return products.filter(
      (p) => (p.category || '').toLowerCase() === categoryName.toLowerCase()
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

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-700" />
          Gestión de Categorías
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Crea, renombra o elimina categorías. Los cambios se reflejarán instantáneamente en la tienda y filtros de productos.
        </p>
      </div>

      {/* Row: Add Category Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50/50 p-4 rounded-md border border-gray-150">
        <div className="flex-1 max-w-none sm:max-w-sm">
          <Input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Ej. Accesorios de Maquillaje"
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
            <li>Al **Eliminar** una categoría, todos sus productos asociados serán reasignados de forma segura a la categoría `"otros"` para evitar que queden huérfanos.</li>
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

                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/40 transition-colors">
                        
                        {/* Category Name Column */}
                        <td className="p-3.5 pl-4 font-bold text-gray-800">
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
                            <span>{cat.nombre}</span>
                          )}
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
                          : 'border-gray-250 text-gray-600 hover:bg-gray-50'
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
                          : 'border-gray-250 text-gray-650 hover:bg-gray-50'
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

      {/* Delete Confirmation Modal */}
      {deletingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-250 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm uppercase tracking-wide">¿Confirmar Eliminación?</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              ¿Estás seguro de que deseas eliminar la categoría <strong className="text-gray-800">"{deletingName}"</strong>? 
              <br/><br/>
              Si hay productos pertenecientes a esta categoría, se reasignarán a <strong className="text-gray-800">"otros"</strong> automáticamente.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 py-2 text-xs rounded-md"
                onClick={() => setDeletingName(null)}
              >
                Cancelar
              </Button>
              <button
                className="flex-1 py-2 text-xs bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
