import React, { useState, useMemo } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { compressToWebP } from '../../utils/imageProcessor';

export default function InventoryPanel({
  products,
  updateProductStock,
  updateProductPrice,
  addProduct,
  editProduct,
  deleteProduct,
  isAddProductOpen,
  setIsAddProductOpen,
  categories = ['Maquillaje', 'Manicura', 'Ropa', 'Accesorios', 'Termos']
}) {
  // Local fallback if parameters are not passed, otherwise sync with parent
  const [localIsModalOpen, setLocalIsModalOpen] = useState(false);
  const isModalOpen = isAddProductOpen !== undefined ? isAddProductOpen : localIsModalOpen;
  const setIsModalOpen = setIsAddProductOpen !== undefined ? setIsAddProductOpen : setLocalIsModalOpen;
  const [imagePreview, setImagePreview] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Category filter + Pagination states
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filter changes
  const handleCategoryFilter = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description || '',
      image: product.image,
      activo: product.activo !== false,
      relevante: product.relevante === true
    });
    setImagePreview(product.image);
    setCompressionRatio(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      category: categories[0] || 'Maquillaje',
      description: '',
      image: '',
      activo: true,
      relevante: false
    });
    setImagePreview('');
    setCompressionRatio(null);
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: categories[0] || 'Maquillaje',
    description: '',
    image: '',
    activo: true,
    relevante: false
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCompressing(true);
    setCompressionRatio(null);
    try {
      const originalSize = file.size;

      // 1. Process image using our Canvas compressToWebP utility
      const webpBlob = await compressToWebP(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
      const compressedSize = webpBlob.size;

      // Convert compressed blob to Base64 so it persists in LocalStorage
      const reader = new FileReader();
      reader.readAsDataURL(webpBlob);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImagePreview(base64data);
        setNewProduct((prev) => ({ ...prev, image: base64data }));
        
        // Calculate compression stats
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        setCompressionRatio({
          original: (originalSize / 1024).toFixed(1),
          compressed: (compressedSize / 1024).toFixed(1),
          ratio
        });
        setCompressing(false);
      };
    } catch (err) {
      console.error(err);
      alert('Error al procesar la foto: ' + err.message);
      setCompressing(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Por favor completa los campos requeridos.');
      return;
    }

    // Assign default image if none provided
    const productData = {
      ...newProduct,
      image: newProduct.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop'
    };

    if (editingProduct) {
      editProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    
    // Reset form
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      category: categories[0] || 'Maquillaje',
      description: '',
      image: '',
      activo: true,
      relevante: false
    });
    setImagePreview('');
    setCompressionRatio(null);
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  // Filter by category, then paginate
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'Todos') return products;
    return products.filter(
      (p) => (p.category || '').toLowerCase() === categoryFilter.toLowerCase()
    );
  }, [products, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Main Inventory list */}
      <div className={`flex-1 bg-white p-4 md:p-6 rounded-xl border border-gray-200/80 shadow-xs h-full flex flex-col overflow-hidden ${isModalOpen ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Header and Add button */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Control de Inventario</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Presiona Enter o haz click fuera del casillero para guardar cambios al instante.
            </p>
          </div>
          {!isModalOpen && (
            <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="gap-2 text-xs py-2 px-4 rounded-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Añadir Producto
            </Button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['Todos', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-zinc-900 border-zinc-900 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-zinc-700 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-gray-400 font-bold self-center uppercase tracking-wider">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

      {/* Grid inventory list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest bg-gray-50/80">
              <th className="p-4 rounded-l-md">Producto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio ($)</th>
              <th className="p-4">Stock</th>
              <th className="p-4 rounded-r-md text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                
                {/* Product details */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover bg-gray-50 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 block truncate max-w-[150px]">{product.name}</span>
                      {product.activo === false && (
                        <span className="bg-red-50 text-red-650 border border-red-150 text-[9px] font-bold px-1.5 py-0.25 rounded shrink-0">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="p-4">
                  <Badge variant="neutral">{product.category}</Badge>
                </td>

                {/* Price editable input */}
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={product.price}
                      onBlur={(e) => updateProductPrice(product.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateProductPrice(product.id, e.target.value);
                          e.target.blur();
                        }
                      }}
                      className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
                    />
                  </div>
                </td>

                {/* Stock editable input */}
                <td className="p-4">
                  <input
                    type="number"
                    defaultValue={product.stock}
                    onBlur={(e) => updateProductStock(product.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateProductStock(product.id, e.target.value);
                        e.target.blur();
                      }
                    }}
                    className={`w-16 px-2 py-1 border rounded-md text-sm text-center font-bold focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      product.stock === 0
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : product.stock <= 5
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </td>

                 {/* Action buttons (Edit & Delete) */}
                 <td className="p-4 text-right flex items-center justify-end gap-2">
                   <button
                     onClick={() => handleStartEdit(product)}
                     className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                     title="Editar producto"
                   >
                     <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                   </button>
                   <button
                     onClick={() => setDeletingProduct(product)}
                     className="p-2 text-gray-500 hover:text-red-650 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                     title="Eliminar producto"
                   >
                     <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                 </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 shrink-0">
          <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">
            Página {currentPage} de {totalPages} · {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredProducts.length)} de {filteredProducts.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 border rounded-lg transition-colors cursor-pointer bg-white ${
                currentPage === 1
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-gray-250 text-gray-650 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  page === currentPage
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-zinc-700'
                }`}
              >
                {page}
              </button>
            ))}
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

      </div>

      {/* Right Drawer Side Panel: Agregar Nuevo Producto */}
      {isModalOpen && (
        <div className="w-full lg:w-[420px] bg-white p-6 lg:p-8 rounded-3xl border border-gray-200 shadow-lg flex flex-col justify-between overflow-y-auto max-h-full transition-all animate-fade-in shrink-0 text-left">
          <div>
            {/* Back to list button on mobile/tablet */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="lg:hidden mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors border-0 bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al inventario
            </button>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-150">
              <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Sección 1: Datos Básicos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1.5 rounded-full w-max text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-[9px] font-black">1</span>
                  <span>Datos del Producto</span>
                </div>
                <Input
                  label="Nombre del Producto *"
                  className="rounded-xl text-xs font-semibold"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ej: Labial Mate Gloss"
                  required
                />
                
                <div>
                  <label className="text-xs font-bold text-gray-800 mb-1.5 block">Categoría *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-800/20 focus:border-zinc-800 transition-all cursor-pointer text-gray-800 font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-800">Descripción</label>
                  <textarea
                    rows="2.5"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-zinc-800/20 focus:border-zinc-800 focus:outline-none transition-all text-xs bg-gray-50/70 text-gray-800 font-medium placeholder-gray-400 resize-none"
                    placeholder="Detalla las características del producto..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="product-activo-checkbox"
                      checked={newProduct.activo !== false}
                      onChange={(e) => setNewProduct({ ...newProduct, activo: e.target.checked })}
                      className="w-4 h-4 text-zinc-950 focus:ring-zinc-800 rounded cursor-pointer"
                    />
                    <label htmlFor="product-activo-checkbox" className="text-xs font-bold text-gray-800 cursor-pointer">
                      Producto Activo
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="product-relevante-checkbox"
                      checked={newProduct.relevante === true}
                      onChange={(e) => setNewProduct({ ...newProduct, relevante: e.target.checked })}
                      className="w-4 h-4 text-zinc-950 focus:ring-zinc-800 rounded cursor-pointer"
                    />
                    <label htmlFor="product-relevante-checkbox" className="text-xs font-bold text-gray-800 cursor-pointer">
                      Promoción Especial
                    </label>
                  </div>
                </div>
              </div>

              {/* Sección 2: Inventario y Precios */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full w-max text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">2</span>
                  <span>Precios e Inventario</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Precio ($) *"
                    type="number"
                    step="0.01"
                    className="rounded-xl text-xs font-semibold"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Ej: 24.50"
                    required
                  />
                  <Input
                    label="Stock Inicial *"
                    type="number"
                    className="rounded-xl text-xs font-semibold"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="Ej: 20"
                    required
                  />
                </div>
              </div>

              {/* Sección 3: Imagen */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full w-max text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black">3</span>
                  <span>Imagen y Previsualización</span>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-850 mb-1.5 block">Foto del Producto (Compresión WebP)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-300 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-zinc-500 transition-all">
                      <svg className="w-6 h-6 text-zinc-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-bold text-zinc-600">Subir foto (.png, .jpg)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-150 shrink-0 shadow-xxs">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  
                  {compressing && (
                    <p className="text-xxs text-blue-600 font-bold mt-2 animate-pulse">Procesando y comprimiendo imagen a WebP...</p>
                  )}
                  
                  {compressionRatio && (
                    <div className="mt-2.5 bg-green-50/70 p-2.5 rounded-xl border border-green-150 flex items-center justify-between text-[10px]">
                      <div>
                        <span className="font-bold text-green-800 block">✓ WebP Comprimido</span>
                        <span className="text-green-600 font-medium">
                          De {compressionRatio.original} KB a {compressionRatio.compressed} KB
                        </span>
                      </div>
                      <span className="font-black text-green-700 bg-green-200/50 px-2 py-0.5 rounded-md">
                        -{compressionRatio.ratio}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Vista previa en miniatura de Tienda */}
                <div className="border border-gray-200 p-4 rounded-2xl bg-zinc-50/80 mt-1 select-none">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">Previsualización en Tienda</span>
                  <div className="bg-white rounded-xl border border-gray-150 p-3.5 text-xs shadow-xxs max-w-[220px] mx-auto text-left">
                    <div className="aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden mb-2 relative border border-gray-100">
                      <img 
                        src={newProduct.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop'} 
                        className="w-full h-full object-cover" 
                        alt="Preview Mini"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-zinc-950 text-white text-[8px] font-bold px-2 py-0.5 rounded border border-zinc-950 uppercase tracking-wider">{newProduct.category}</span>
                    </div>
                    <h5 className="font-bold text-gray-900 truncate text-xs block">{newProduct.name || 'Nombre del Producto'}</h5>
                    <p className="text-gray-500 text-[10px] line-clamp-1 mt-0.5 font-medium">{newProduct.description || 'Descripción del producto...'}</p>
                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100">
                      <span className="text-zinc-950 font-black text-sm block">${parseFloat(newProduct.price || 0).toFixed(2)}</span>
                      <span className="text-[10px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 border border-gray-100 rounded">{newProduct.stock || 0} un.</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={handleCloseModal} className="rounded-full text-xs py-2.5 px-6 cursor-pointer">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={compressing} className="rounded-full text-xs py-2.5 px-6 cursor-pointer">
                  {compressing ? 'Guardando...' : 'Guardar Producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-gray-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-650">
              <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide">¿Confirmar Eliminación?</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              ¿Estás seguro de que deseas eliminar el producto <strong className="text-gray-800">"{deletingProduct.name}"</strong>? 
              <br/><br/>
              Esta acción no se puede deshacer y el producto desaparecerá del catálogo de la tienda.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 py-2 text-xs rounded-md"
                onClick={() => setDeletingProduct(null)}
              >
                Cancelar
              </Button>
              <button
                className="flex-1 py-2 text-xs bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                onClick={() => {
                  deleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
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
