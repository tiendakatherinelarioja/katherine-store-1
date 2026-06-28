import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useCart } from '../context/CartContext';
import { sendEmailNotification, formatOrderEmailHtml } from '../services/emailService';

export function useOrders({ subscribeRealtime = false } = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  // Normalize postgres structure to frontend properties
  const normalizeOrder = useCallback((o) => {
    const rawItems = o.items || o.detalles_pedido || [];
    const items = rawItems.map((d) => ({
      id: d.producto_id || d.productos?.id,
      name: d.nombre_producto || d.productos?.nombre || 'Producto',
      quantity: d.cantidad,
      price: parseFloat(d.precio_unitario)
    }));
    
    // Use server-computed total from the view to avoid recalculation
    const total = o.total !== undefined
      ? parseFloat(o.total)
      : items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: o.id,
      cliente: o.cliente_apellido ? `${o.cliente_nombre} ${o.cliente_apellido}` : o.cliente_nombre,
      telefono: o.cliente_telefono,
      email: o.cliente_email,
      direccion: o.direccion_fisica || o.direccion,
      metodoPago: o.metodo_pago === 'efectivo_retiro' ? 'efectivo' : o.metodo_pago,
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
      // Select only the columns that exist in vista_pedidos_completos
      const { data, error: fetchErr } = await supabase
        .from('vista_pedidos_completos')
        .select('id, cliente_nombre, cliente_telefono, cliente_email, direccion_fisica, metodo_pago, metodo_envio, estado, total, created_at, items')
        .order('created_at', { ascending: false })
        .limit(50);

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
        apellido: clienteInfo.apellido,
        telefono: clienteInfo.telefono,
        email: clienteInfo.email || null,
        direccion: clienteInfo.metodoEnvio === 'envio' ? clienteInfo.direccion : 'Retiro en local',
        metodo_pago: clienteInfo.metodoPago === 'efectivo' ? 'efectivo_retiro' : clienteInfo.metodoPago,
        metodo_envio: clienteInfo.metodoEnvio,
        cupon_codigo: clienteInfo.cupon_codigo || null,
        descuento: clienteInfo.descuento || 0,
        total_con_descuento: clienteInfo.total_con_descuento || null
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

      // Send email notification to admin and client asynchronously
      try {
        const orderSummary = {
          id: 'NUEVO',
          cliente: cliente_info.nombre,
          telefono: cliente_info.telefono,
          email: cliente_info.email,
          direccion: cliente_info.direccion,
          metodoPago: cliente_info.metodo_pago,
          metodoEnvio: cliente_info.metodo_envio,
          estado: 'pendiente',
          total: cliente_info.total_con_descuento !== null ? cliente_info.total_con_descuento : cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
          items: cartItems.map(item => ({
            name: item.nombre,
            price: item.precio,
            quantity: item.cantidad
          }))
        };
        
        if (cliente_info.cupon_codigo) {
          orderSummary.couponApplied = {
            codigo: cliente_info.cupon_codigo,
            discountAmount: cliente_info.descuento
          };
        }

        const adminEmailHtml = formatOrderEmailHtml(orderSummary);
        const adminEmailAddress = import.meta.env.VITE_ADMIN_EMAIL || 'admin@katherine.com';

        // Notify Admin
        sendEmailNotification({
          to: adminEmailAddress,
          subject: `🛒 Nuevo Pedido Katherine Store - Cliente: ${cliente_info.nombre}`,
          html: adminEmailHtml
        });

        // Notify Client
        if (cliente_info.email) {
          const clientEmailHtml = formatOrderEmailHtml(orderSummary);
          sendEmailNotification({
            to: cliente_info.email,
            subject: `✨ Gracias por tu compra en Katherine Store!`,
            html: clientEmailHtml
          });
        }
      } catch (emailErr) {
        console.error('Error sending order confirmation emails:', emailErr);
      }

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

      // Find the specific updated order
      const updatedOrder = orders.find(o => o.id === pedidoId);
      if (updatedOrder) {
        const orderSummary = {
          ...updatedOrder,
          estado: nuevoEstado.toLowerCase()
        };

        const emailHtml = formatOrderEmailHtml(orderSummary);
        const adminEmailAddress = import.meta.env.VITE_ADMIN_EMAIL || 'admin@katherine.com';

        // Send Email notification to Admin
        sendEmailNotification({
          to: adminEmailAddress,
          subject: `🔔 Cambio de Estado Pedido #${pedidoId.slice(-6)} - Katherine Store`,
          html: `<p>El pedido del cliente <strong>${orderSummary.cliente}</strong> ha sido cambiado a: <strong>${nuevoEstado.toUpperCase()}</strong>.</p>${emailHtml}`
        });

        // Send Email notification to Client
        if (orderSummary.email) {
          sendEmailNotification({
            to: orderSummary.email,
            subject: `📦 Actualización de tu pedido en Katherine Store - #${pedidoId.slice(-6)}`,
            html: `<p>Hola ${orderSummary.cliente}, te informamos que tu pedido ha sido actualizado al estado: <strong style="text-transform: uppercase; color: #16a34a;">${nuevoEstado}</strong>.</p>${emailHtml}`
          });
        }
      }

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
    if (!subscribeRealtime) return;

    const channel = supabase
      .channel('pedidos-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        async (payload) => {
          console.log('Realtime update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Fetch complete order joins with details (specific columns only)
            const { data, error: fetchErr } = await supabase
              .from('vista_pedidos_completos')
              .select('id, cliente_nombre, cliente_telefono, cliente_email, direccion_fisica, metodo_pago, metodo_envio, estado, total, created_at, items')
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
  }, [normalizeOrder, subscribeRealtime]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    checkoutAsGuest,
    updateOrderStatus
  };
}
