import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export function useProducts(isAdmin = false) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (category = null) => {
    try {
      setLoading(true);
      setError(null);

      // Select table or optimized active view
      const source = isAdmin ? 'productos' : 'vista_catalogo_activo';
      let query = supabase.from(source).select('*');

      // Filter by category column using lowcase database ENUM representation
      if (category && category !== 'Todos') {
        query = query.eq('categoria', category.toLowerCase());
      }

      const { data, error: fetchErr } = await query;

      if (fetchErr) throw fetchErr;

      // Normalize fields so the front-end components render seamlessly
      const normalized = (data || []).map((item) => ({
        id: item.id,
        name: item.nombre || item.name || '',
        price: parseFloat(item.precio || item.price || 0),
        image: item.imagen_url || item.image_url || item.image || '',
        category: item.categoria || item.category || '',
        description: item.descripcion || item.description || '',
        rating: parseFloat(item.rating || 5.0),
        reviewsCount: parseInt(item.reviews_count || item.reviewsCount || 0, 10),
        stock: parseInt(item.stock || 0, 10)
      }));

      setProducts(normalized);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError(err.message || 'Error al conectar con el catálogo en Supabase.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Admin stock modifications
  const updateProductStock = async (productId, newStock) => {
    try {
      const { error: updateErr } = await supabase
        .from('productos')
        .update({ stock: Math.max(0, parseInt(newStock, 10)) })
        .eq('id', productId);

      if (updateErr) throw updateErr;
      
      // Update local state to avoid refetching
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, parseInt(newStock, 10)) } : p))
      );
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      alert('Error en base de datos al actualizar stock: ' + err.message);
    }
  };

  // Admin price modifications
  const updateProductPrice = async (productId, newPrice) => {
    try {
      const { error: updateErr } = await supabase
        .from('productos')
        .update({ precio: Math.max(0, parseFloat(newPrice)) })
        .eq('id', productId);

      if (updateErr) throw updateErr;

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: Math.max(0, parseFloat(newPrice)) } : p))
      );
    } catch (err) {
      console.error('Error al actualizar precio:', err);
      alert('Error en base de datos al actualizar precio: ' + err.message);
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      const insertData = {
        nombre: productData.name,
        precio: parseFloat(productData.price),
        stock: parseInt(productData.stock, 10),
        categoria: productData.category.toLowerCase(),
        descripcion: productData.description,
        imagen_url: productData.image
      };

      const { error: insertErr } = await supabase
        .from('productos')
        .insert([insertData]);

      if (insertErr) throw insertErr;

      // Refresh list
      fetchProducts();
    } catch (err) {
      console.error('Error al insertar producto:', err);
      alert('Error en base de datos al guardar producto: ' + err.message);
    }
  };

  // Edit existing product details
  const editProduct = async (productId, productData) => {
    try {
      const updateData = {
        nombre: productData.name,
        precio: parseFloat(productData.price),
        stock: parseInt(productData.stock, 10),
        categoria: productData.category.toLowerCase(),
        descripcion: productData.description,
        imagen_url: productData.image
      };

      const { error: updateErr } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', productId);

      if (updateErr) throw updateErr;

      // Refresh list
      fetchProducts();
    } catch (err) {
      console.error('Error al editar producto:', err);
      alert('Error en base de datos al editar producto: ' + err.message);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const { error: deleteErr } = await supabase
        .from('productos')
        .delete()
        .eq('id', productId);

      if (deleteErr) throw deleteErr;

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error en base de datos al eliminar producto: ' + err.message);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    updateProductStock,
    updateProductPrice,
    addProduct,
    editProduct,
    deleteProduct
  };
}
