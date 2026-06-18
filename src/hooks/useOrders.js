import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../context/CartContext';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  // Normalize postgres structure to frontend properties
  const normalizeOrder = useCallback((o) => {
    const items = (o.detalles_pedido || []).map((d) => ({
      id: d.productos?.id || d.producto_id,
      name: d.productos?.nombre || 'Producto',
      quantity: d.cantidad,
      price: parseFloat(d.precio_unitario)
    }));
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: o.id,
      cliente: o.cliente_nombre,
      telefono: o.cliente_telefono,
      email: o.cliente_email,
      direccion: o.direccion,
      metodoPago: o.metodo_pago,
      metodoEnvio: o.metodo_envio,
      estado: o.estado,
      fecha: new Date(o.created_at).toLocaleString(),
      items,
      total
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchErr } = await supabase
        .from('pedidos')
        .select(`
          *,
          detalles_pedido (
            id,
            cantidad,
            precio_unitario,
            productos (
              id,
              nombre
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;

      const normalized = (data || []).map(normalizeOrder);
      setOrders(normalized);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
      setError(err.message || 'Error al conectar con la base de datos de pedidos.');
    } finally {
      setLoading(false);
    }
  }, [normalizeOrder]);

  // Client checkout logic calling stored RPC procedure
  const checkoutAsGuest = async (clienteInfo, cartItems) => {
    try {
      setLoading(true);
      setError(null);

      // Structure data as required by Postgres JSONB
      const cliente_info = {
        nombre: clienteInfo.nombre,
        telefono: clienteInfo.telefono,
        email: clienteInfo.email || null,
        direccion: clienteInfo.metodoEnvio === 'envio' ? clienteInfo.direccion : 'Retiro en local',
        metodo_pago: clienteInfo.metodoPago,
        metodo_envio: clienteInfo.metodoEnvio
      };

      const items_carrito = cartItems.map((item) => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }));

      // Call supabase RPC transaction
      const { error: rpcErr } = await supabase.rpc('crear_pedido_invitado', {
        cliente_info,
        items_carrito
      });

      if (rpcErr) throw rpcErr;

      // Empty cart on success
      clearCart();
      return { success: true };
    } catch (err) {
      console.error('Error en checkout RPC:', err);
      setError(err.message || 'Error al procesar la reserva del pedido.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin update status trigger
  const updateOrderStatus = async (pedidoId, nuevoEstado) => {
    try {
      setError(null);
      const { error: updateErr } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado.toLowerCase() })
        .eq('id', pedidoId);

      if (updateErr) throw updateErr;

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === pedidoId ? { ...o, estado: nuevoEstado } : o))
      );
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError(err.message || 'Error al actualizar el estado del pedido.');
      alert('Error en base de datos: ' + err.message);
    }
  };

  // Realtime changes listener for Admin Dashboard
  useEffect(() => {
    const channel = supabase
      .channel('pedidos-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        async (payload) => {
          console.log('Realtime update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Fetch complete order joins with details
            const { data, error: fetchErr } = await supabase
              .from('pedidos')
              .select(`
                *,
                detalles_pedido (
                  id,
                  cantidad,
                  precio_unitario,
                  productos (
                    id,
                    nombre
                  )
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (!fetchErr && data) {
              setOrders((prev) => [normalizeOrder(data), ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            // Re-fetch or partially update locally
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? { ...o, estado: payload.new.estado } : o))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [normalizeOrder]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    checkoutAsGuest,
    updateOrderStatus
  };
}
