import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, texto: '🎉 ¡Envío gratis en compras mayores a $15.000! 🎉', activo: true, link: '#' },
  { id: 2, texto: '✨ 15% OFF abonando en efectivo o transferencia ✨', activo: true, link: '#' }
];

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first (1 hour TTL)
      const cacheKey = 'katherine_anuncios_cache';
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 3600000) { // 1 hora
            setAnnouncements(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      // Attempt to query Supabase announcements table
      const { data, error: fetchErr } = await supabase
        .from('anuncios')
        .select('*')
        .order('id', { ascending: true });

      if (fetchErr) {
        // If table doesn't exist, use fallback
        if (fetchErr.code === 'PGRST116' || fetchErr.message.includes('relation') || fetchErr.message.includes('does not exist')) {
          console.warn('La tabla "anuncios" no existe en Supabase. Usando almacenamiento local (localStorage) como fallback.');
          setUsingFallback(true);
          const saved = localStorage.getItem('katherine_anuncios');
          if (saved) {
            setAnnouncements(JSON.parse(saved));
          } else {
            setAnnouncements(DEFAULT_ANNOUNCEMENTS);
            localStorage.setItem('katherine_anuncios', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
          }
          return;
        }
        throw fetchErr;
      }

      setAnnouncements(data || []);
      setUsingFallback(false);
      
      // Save cache
      if (data && data.length > 0) {
        localStorage.setItem('katherine_anuncios_cache', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error('Error al cargar anuncios de Supabase:', err);
      setError(err.message || 'Error al conectar con la tabla de anuncios.');
      
      // Fallback
      setUsingFallback(true);
      const saved = localStorage.getItem('katherine_anuncios');
      if (saved) {
        setAnnouncements(JSON.parse(saved));
      } else {
        setAnnouncements(DEFAULT_ANNOUNCEMENTS);
        localStorage.setItem('katherine_anuncios', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const addAnnouncement = async (texto, link = '#') => {
    const cleanText = (texto || '').trim();
    if (!cleanText) return;

    if (!usingFallback) {
      try {
        const { error: insertErr } = await supabase
          .from('anuncios')
          .insert([{ texto: cleanText, link, activo: true }]);

        if (insertErr) throw insertErr;
        localStorage.removeItem('katherine_anuncios_cache'); // Invalidate cache
        await fetchAnnouncements();
        return { success: true };
      } catch (err) {
        console.error('Error al agregar anuncio en Supabase:', err);
        // If it fails, we fall back to localStorage update
        alert('Error en base de datos. Se guardará de forma local temporalmente.');
      }
    }

    // Local fallback logic
    const newAnn = {
      id: Date.now(),
      texto: cleanText,
      link: link || '#',
      activo: true,
      created_at: new Date().toISOString()
    };
    setAnnouncements((prev) => {
      const updated = [...prev, newAnn];
      localStorage.setItem('katherine_anuncios', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  const updateAnnouncement = async (id, fields) => {
    if (!usingFallback && typeof id === 'number' && id < 1000000000) {
      try {
        const { error: updateErr } = await supabase
          .from('anuncios')
          .update(fields)
          .eq('id', id);

        if (updateErr) throw updateErr;
        localStorage.removeItem('katherine_anuncios_cache'); // Invalidate cache
        await fetchAnnouncements();
        return { success: true };
      } catch (err) {
        console.error('Error al actualizar anuncio en Supabase:', err);
        alert('Error en base de datos al actualizar. Guardando localmente.');
      }
    }

    // Local fallback update
    setAnnouncements((prev) => {
      const updated = prev.map((ann) => (ann.id === id ? { ...ann, ...fields } : ann));
      localStorage.setItem('katherine_anuncios', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  const deleteAnnouncement = async (id) => {
    if (!usingFallback && typeof id === 'number' && id < 1000000000) {
      try {
        const { error: deleteErr } = await supabase
          .from('anuncios')
          .delete()
          .eq('id', id);

        if (deleteErr) throw deleteErr;
        localStorage.removeItem('katherine_anuncios_cache'); // Invalidate cache
        await fetchAnnouncements();
        return { success: true };
      } catch (err) {
        console.error('Error al eliminar anuncio de Supabase:', err);
        alert('Error en base de datos al eliminar. Eliminando localmente.');
      }
    }

    // Local fallback delete
    setAnnouncements((prev) => {
      const updated = prev.filter((ann) => ann.id !== id);
      localStorage.setItem('katherine_anuncios', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  return {
    announcements,
    loading,
    error,
    usingFallback,
    refreshAnnouncements: fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
}
