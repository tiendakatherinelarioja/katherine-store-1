import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const DEFAULT_CATEGORIES = ['Maquillaje', 'Manicura', 'Ropa', 'Accesorios', 'Termos'];

export function useCategories() {
  const [categoriesList, setCategoriesList] = useState([]); // [{ id, nombre }]
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES); // ['Maquillaje', ...]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre', { ascending: true });

      if (fetchErr) {
        // If the table doesn't exist or is not queryable yet, fallback gracefully
        if (fetchErr.code === 'PGRST116' || fetchErr.message.includes('relation') || fetchErr.message.includes('does not exist')) {
          console.warn('La tabla "categorias" no existe en la BD. Usando categorías por defecto.');
          setCategories(DEFAULT_CATEGORIES);
          setCategoriesList(DEFAULT_CATEGORIES.map((cat, idx) => ({ id: idx.toString(), nombre: cat })));
          return;
        }
        throw fetchErr;
      }

      if (data && data.length > 0) {
        // Standardize category name casing (e.g. Maquillaje)
        const formattedList = data.map((item) => ({
          id: item.id,
          nombre: item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)
        }));
        setCategoriesList(formattedList);
        setCategories(formattedList.map((item) => item.nombre));
      } else {
        setCategoriesList([]);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error al cargar categorias:', err);
      setError(err.message || 'Error al conectar con la tabla de categorías.');
      // Fallback
      setCategories(DEFAULT_CATEGORIES);
      setCategoriesList(DEFAULT_CATEGORIES.map((cat, idx) => ({ id: idx.toString(), nombre: cat })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Create category
  const addCategory = async (name) => {
    try {
      const cleanName = name.trim();
      if (!cleanName) return;

      // Capitalize first letter to save nicely
      const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();

      const { error: insertErr } = await supabase
        .from('categorias')
        .insert([{ nombre: capitalized }]);

      if (insertErr) throw insertErr;

      await fetchCategories();
    } catch (err) {
      console.error('Error al agregar categoría:', err);
      alert('Error en base de datos al guardar categoría: ' + err.message);
    }
  };

  // Update/Rename category
  const updateCategory = async (oldName, newName) => {
    try {
      const cleanOld = oldName.trim();
      const cleanNew = newName.trim();
      if (!cleanOld || !cleanNew || cleanOld === cleanNew) return;

      const capitalizedNew = cleanNew.charAt(0).toUpperCase() + cleanNew.slice(1).toLowerCase();

      // 1. Update name in categorias table
      const { error: updateErr } = await supabase
        .from('categorias')
        .update({ nombre: capitalizedNew })
        .eq('nombre', cleanOld);

      if (updateErr) throw updateErr;

      // 2. Cascade rename to all products using lowercased names
      const { error: productsErr } = await supabase
        .from('productos')
        .update({ categoria: capitalizedNew.toLowerCase() })
        .eq('categoria', cleanOld.toLowerCase());

      if (productsErr) {
        console.warn('Advertencia al actualizar productos vinculados:', productsErr.message);
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error al renombrar categoría:', err);
      alert('Error al renombrar categoría: ' + err.message);
    }
  };

  // Delete category
  const deleteCategory = async (name) => {
    try {
      const cleanName = name.trim();
      if (!cleanName) return;

      // 1. Delete from categories
      const { error: deleteErr } = await supabase
        .from('categorias')
        .delete()
        .eq('nombre', cleanName);

      if (deleteErr) throw deleteErr;

      // 2. Reassign any orphaned products to 'otros'
      const { error: productsErr } = await supabase
        .from('productos')
        .update({ categoria: 'otros' })
        .eq('categoria', cleanName.toLowerCase());

      if (productsErr) {
        console.warn('Advertencia al reasignar productos huérfanos:', productsErr.message);
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert('Error al eliminar categoría: ' + err.message);
    }
  };

  return {
    categories,
    categoriesList,
    loading,
    error,
    refreshCategories: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
