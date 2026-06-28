import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export function useCoupons({ enabled = true } = {}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchErr } = await supabase
        .from('cupones')
        .select('id, codigo, tipo, valor, activo, created_at')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setCoupons(data || []);
    } catch (err) {
      console.error('Error al obtener cupones de Supabase:', err);
      setError(err.message || 'Error al conectar con la base de datos de cupones.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCoupon = async (couponData) => {
    try {
      setLoading(true);
      const cleanCode = couponData.codigo.trim().toUpperCase();
      if (!cleanCode) throw new Error('El código del cupón no puede estar vacío.');

      const { data, error: insertErr } = await supabase
        .from('cupones')
        .insert([{
          codigo: cleanCode,
          tipo: couponData.tipo, // 'porcentaje' o 'fijo'
          valor: parseFloat(couponData.valor),
          activo: true
        }]);

      if (insertErr) throw insertErr;
      await fetchCoupons();
      return { success: true };
    } catch (err) {
      console.error('Error al agregar cupón en Supabase:', err);
      alert('Error en base de datos: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      setLoading(true);
      const { error: deleteErr } = await supabase
        .from('cupones')
        .delete()
        .eq('id', id);

      if (deleteErr) throw deleteErr;
      setCoupons(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar cupón de Supabase:', err);
      alert('Error en base de datos al eliminar cupón: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (code) => {
    try {
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return { success: false, error: 'Código de cupón vacío.' };

      const { data, error: fetchErr } = await supabase
        .from('cupones')
        .select('id, codigo, tipo, valor')
        .eq('codigo', cleanCode)
        .eq('activo', true)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (!data) {
        return { success: false, error: 'El cupón no es válido o ha expirado.' };
      }

      return { success: true, coupon: data };
    } catch (err) {
      console.error('Error al validar cupón:', err);
      return { success: false, error: 'Error al verificar cupón en la base de datos.' };
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchCoupons();
    }
  }, [fetchCoupons, enabled]);

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    addCoupon,
    deleteCoupon,
    validateCoupon
  };
}
