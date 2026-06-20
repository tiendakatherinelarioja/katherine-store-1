import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  Package, 
  Search, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  Phone, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

export default function MyOrders() {
  const { setView } = useCart();
  const [phone, setPhone] = useState('');
  const [savedPhone, setSavedPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Load saved phone number on mount
  useEffect(() => {
    const localPhone = localStorage.getItem('katherine_client_phone');
    if (localPhone) {
      setSavedPhone(localPhone);
      setPhone(localPhone);
      fetchClientOrders(localPhone);
    }
  }, []);

  const normalizeOrder = useCallback((o) => {
    const rawItems = o.items || o.detalles_pedido || [];
    const items = rawItems.map((d) => ({
      id: d.producto_id || d.productos?.id,
      name: d.nombre_producto || d.productos?.nombre || 'Producto',
      quantity: d.cantidad,
      price: parseFloat(d.precio_unitario)
    }));
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: o.id,
      cliente: o.cliente_nombre,
      telefono: o.cliente_telefono,
      email: o.cliente_email,
      direccion: o.direccion_fisica || o.direccion,
      metodoPago: o.metodo_pago,
      metodoEnvio: o.metodo_envio,
      estado: o.estado || 'pendiente',
      fecha: new Date(o.created_at).toLocaleDateString(),
      items,
      total
    };
  }, []);

  const fetchClientOrders = async (targetPhone) => {
    if (!targetPhone.trim()) return;
    
    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const cleanPhone = targetPhone.trim();
      const { data, error: fetchErr } = await supabase
        .from('vista_pedidos_completos')
        .select('*')
        .eq('cliente_telefono', cleanPhone);

      if (fetchErr) throw fetchErr;

      const normalized = (data || []).map(normalizeOrder);
      // Sort by date descending
      normalized.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      setOrders(normalized);
      localStorage.setItem('katherine_client_phone', cleanPhone);
      setSavedPhone(cleanPhone);
    } catch (err) {
      console.error('Error fetching client orders:', err);
      setError('Ocurrió un error al buscar tus pedidos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClientOrders(phone);
  };

  const handleClearPhone = () => {
    localStorage.removeItem('katherine_client_phone');
    setSavedPhone('');
    setPhone('');
    setOrders([]);
    setSearched(false);
    setError('');
  };

  const getStatusDetails = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: 'text-amber-600 bg-amber-50 border-amber-150',
          dotColor: 'bg-amber-500',
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          desc: 'Tu pedido ha sido recibido. Se encuentra a la espera de validación de pago y stock por parte de la tienda.'
        };
      case 'aceptado':
        return {
          label: 'Aceptado',
          color: 'text-blue-600 bg-blue-50 border-blue-150',
          dotColor: 'bg-blue-500',
          icon: <Package className="w-5 h-5 text-blue-500" />,
          desc: '¡Tu pedido fue aceptado! Estamos preparando tus productos para el envío o retiro.'
        };
      case 'completado':
        return {
          label: 'Completado',
          color: 'text-green-600 bg-green-50 border-green-150',
          dotColor: 'bg-green-500',
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          desc: 'El pedido fue entregado y abonado con éxito. ¡Muchas gracias por tu compra!'
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          color: 'text-red-600 bg-red-50 border-red-150',
          dotColor: 'bg-red-500',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          desc: 'Este pedido ha sido cancelado o rechazado.'
        };
      default:
        return {
          label: estado,
          color: 'text-gray-600 bg-gray-50 border-gray-150',
          dotColor: 'bg-gray-450',
          icon: <Clock className="w-5 h-5 text-gray-500" />,
          desc: 'Estado del pedido en proceso.'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          Seguimiento de Pedidos
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Consulta en tiempo real el estado de tus compras ingresando el número de teléfono con el que realizaste el pedido.
        </p>
      </div>

      {/* Phone input form if not logged in / no phone saved */}
      {!savedPhone ? (
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg max-w-md mx-auto">
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100">
                <Search className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Buscar mis compras</h3>
              <p className="text-xs text-gray-400 mt-1">Ingresa tu número de teléfono de WhatsApp</p>
            </div>

            <Input
              label="Número de Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: +5493804918672"
              required
              helperText="Utiliza el mismo formato con el que completaste tu pedido."
            />

            <Button type="submit" loading={loading} className="w-full justify-center py-3.5 text-xs font-bold">
              Buscar Pedidos
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Saved Phone Status Bar */}
          <div className="bg-gray-50/50 border border-gray-100 px-6 py-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-gray-150 rounded-full flex items-center justify-center shadow-xxs">
                <Phone className="w-4 h-4 text-zinc-950" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Historial de Teléfono</span>
                <span className="font-bold text-gray-900 text-sm">{savedPhone}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => fetchClientOrders(savedPhone)}
                disabled={loading}
                className="px-4 py-2 border border-gray-200 hover:border-zinc-800 bg-white hover:text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xxs active:scale-[0.98]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={handleClearPhone}
                className="px-4 py-2 border border-transparent text-gray-400 hover:text-red-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Consultar otro número
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-xs text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading view */}
          {loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-zinc-950 animate-spin mb-4" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Buscando tus pedidos...</span>
            </div>
          )}

          {/* Search results */}
          {searched && !loading && orders.length === 0 && (
            <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-3xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400 border border-gray-100 mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron pedidos</h3>
              <p className="text-gray-500 text-xs mb-6">
                No pudimos localizar compras activas asociadas al número de teléfono <strong className="text-gray-800">{savedPhone}</strong>.
              </p>
              <Button onClick={handleClearPhone}>Intentar con otro número</Button>
            </div>
          )}

          {/* Order Cards */}
          {orders.length > 0 && (
            <div className="space-y-8">
              {orders.map((order) => {
                const status = getStatusDetails(order.estado);
                return (
                  <div 
                    key={order.id}
                    className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row items-stretch"
                  >
                    {/* Left/Top Status Column */}
                    <div className="w-full md:w-[32%] bg-gray-50/50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 text-left shrink-0">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-gray-400 font-mono tracking-tight">
                            ID: #{order.id.slice(-6).toUpperCase()}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${order.estado.toLowerCase() === 'pendiente' ? 'animate-pulse' : ''}`} />
                            {status.label}
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>{order.fecha}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="font-semibold">{order.metodoEnvio === 'envio' ? 'Envío a Domicilio' : 'Retiro en Local'}</span>
                          </div>
                          {order.metodoEnvio === 'envio' && (
                            <div className="flex items-start gap-2 text-gray-600 pl-6">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                              <span className="text-gray-500 break-words">{order.direccion}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="font-semibold capitalize">{order.metodoPago}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact admin button for this order */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <a
                          href={`https://wa.me/5493804918672?text=${encodeURIComponent(`¡Hola! Quisiera realizar una consulta sobre mi pedido #${order.id.slice(-6).toUpperCase()} que se encuentra en estado *${status.label}*`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-white hover:bg-zinc-950 border border-gray-200 hover:border-zinc-950 text-gray-600 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xxs active:scale-[0.98]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Consultar por WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Right/Bottom Content Column */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between text-left">
                      
                      {/* Status timeline block */}
                      <div className="mb-6 p-4 bg-gray-50/30 border border-gray-100/70 rounded-2xl flex gap-3 text-xs">
                        <div className="mt-0.5 shrink-0">{status.icon}</div>
                        <div>
                          <span className="font-bold text-gray-900 block mb-1">Estado de tu Pedido</span>
                          <p className="text-gray-500 leading-relaxed">{status.desc}</p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Detalle de Productos</h4>
                        <div className="divide-y divide-gray-100/60 max-h-[160px] overflow-y-auto pr-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex justify-between gap-3 text-xs">
                              <div>
                                <span className="font-bold text-gray-900 font-mono">{item.quantity}x</span>{' '}
                                <span className="text-gray-600 font-medium">{item.name}</span>
                              </div>
                              <span className="font-bold text-gray-800 shrink-0">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom totals bar */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monto Total</span>
                        <span className="text-xl font-black text-green-600 font-sans">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
