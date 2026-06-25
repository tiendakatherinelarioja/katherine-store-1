import React, { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Zap, Check, X, PhoneCall, Printer, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function OrdersPanel() {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders({ subscribeRealtime: true });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Find active data from state so it stays updated in real-time
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  const handleExportPDF = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Remito - Orden #${order.id.slice(-6)}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #eaeaea; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #16a34a; }
            .title { float: right; font-size: 20px; font-weight: bold; color: #4b5563; }
            .details { margin-bottom: 30px; font-size: 14px; line-height: 1.6; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { padding: 12px; border-bottom: 1px solid #eaeaea; text-align: left; }
            .table th { background: #f9fafb; font-weight: bold; color: #374151; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 30px; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="logo">
              <img src="${window.location.origin}/logo.png" style="height: 32px; object-fit: contain; vertical-align: middle;" onerror="this.style.display='none'; this.nextSibling.style.display='inline-block';" /><span style="display: none;">● Katherine</span>
            </div>
            <span class="title">REMITO DE PEDIDO</span>
          </div>
          <div class="details">
            <strong>ID de Pedido:</strong> ${order.id}<br/>
            <strong>Fecha:</strong> ${order.fecha}<br/>
            <strong>Cliente:</strong> ${order.cliente}<br/>
            <strong>Teléfono:</strong> ${order.telefono}<br/>
            <strong>Email:</strong> ${order.email || '-'}<br/>
            <strong>Envío:</strong> ${order.metodoEnvio === 'envio' ? 'A Domicilio' : 'Retiro en Local'}<br/>
            <strong>Dirección:</strong> ${order.direccion}<br/>
            <strong>Método de Pago:</strong> ${order.metodoPago.toUpperCase()}
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Neto: $${order.total.toFixed(2)}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleWhatsAppContact = (order) => {
    let text = `Hola ${order.cliente}! Te contacto desde Katherine sobre tu pedido *#${order.id.slice(-6)}* por un valor de *$${order.total.toFixed(2)}*. `;
    if (order.estado === 'pendiente') {
      text += `Queremos coordinar el pago por ${order.metodoPago.toUpperCase()} y programar la entrega de tus productos.`;
    } else if (order.estado === 'aceptado') {
      text += `Tu pedido ha sido procesado con éxito y ya se encuentra en preparación!`;
    }
    const whatsappUrl = `https://wa.me/${order.telefono.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Left panel: Orders list */}
      <div className={`flex-1 bg-white p-4 md:p-6 rounded-xl border border-gray-200/80 shadow-xs overflow-y-auto ${selectedOrderId ? 'hidden lg:flex' : 'flex'} flex-col`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pedidos Recibidos</h2>
            <p className="text-xs text-gray-550 mt-0.5">Gestión operativa en tiempo real</p>
          </div>
          <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 font-semibold px-3 py-1.5 rounded-md flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            En Vivo
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 animate-pulse font-semibold">
            Cargando pedidos de Supabase...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 font-bold">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No se han registrado pedidos en la base de datos aún.
          </div>
        ) : (() => {
          // Pagination calculations
          const totalPages = Math.ceil(orders.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

          return (
            <div className="divide-y divide-gray-100">
              {paginatedOrders.map((order) => {
                const statusColors = {
                  pendiente: 'warning',
                  aceptado: 'info',
                  completado: 'success',
                  cancelado: 'danger'
                };

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-xl cursor-pointer flex items-center justify-between gap-4 border transition-all duration-200 active:scale-[0.99] ${
                      selectedOrderId === order.id
                        ? 'bg-zinc-50/80 border-zinc-250 shadow-xxs scale-[1.005] translate-x-0.5'
                        : 'border-transparent hover:bg-gray-50/80 hover:translate-x-0.5'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">
                          {order.cliente}
                        </span>
                        <span className="text-xs text-gray-550">#{order.id.slice(-4)}</span>
                      </div>
                      <p className="text-xs text-gray-550 truncate">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <span className="text-[10px] text-gray-550 block mt-1">{order.fecha}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-extrabold text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                      <Badge variant={statusColors[order.estado] || 'neutral'}>
                        {order.estado}
                      </Badge>
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 shrink-0">
                  <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">
                    Página {currentPage} de {totalPages} ({orders.length} pedidos)
                  </span>
                  <div className="flex gap-1.5">
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
          );
        })()}
      </div>

      {/* Right panel: Details Drawer */}
      <div className={`w-full lg:w-96 bg-white p-4 md:p-6 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between overflow-y-auto max-h-full ${selectedOrderId ? 'flex' : 'hidden lg:flex'}`}>
        {selectedOrder ? (
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              {/* Back to list button on mobile/tablet */}
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="lg:hidden mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors border-0 bg-transparent cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver a la lista
              </button>

              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Detalles del Pedido</h3>
                  <span className="text-xs text-gray-500 font-semibold">Orden ID: #{selectedOrder.id.slice(-6)}</span>
                </div>
                <Badge variant={
                  selectedOrder.estado === 'pendiente' ? 'warning' :
                  selectedOrder.estado === 'aceptado' ? 'info' :
                  selectedOrder.estado === 'completado' ? 'success' : 'danger'
                } className="rounded-sm">
                  {selectedOrder.estado.toUpperCase()}
                </Badge>
              </div>
 
              {/* Client specs */}
              <div className="space-y-4 text-sm mb-6">
                <div>
                  <span className="text-xs text-gray-500 font-bold block">Cliente</span>
                  <span className="font-bold text-gray-900">{selectedOrder.cliente}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold block">Teléfono / Email</span>
                  <span className="font-medium text-gray-800">{selectedOrder.telefono}</span>
                  {selectedOrder.email && <span className="block text-xs text-gray-600">{selectedOrder.email}</span>}
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold block">Envío y Dirección</span>
                  <span className="font-bold text-gray-900">
                    {selectedOrder.metodoEnvio === 'envio' ? 'Envío a Domicilio' : 'Retiro por Local'}
                  </span>
                  <span className="block text-xs text-gray-600">{selectedOrder.direccion}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold block">Método de Pago</span>
                  <span className="font-medium text-gray-800 uppercase">{selectedOrder.metodoPago}</span>
                </div>
              </div>
 
              {/* Items Summary */}
              <div className="border-t border-b border-gray-250 py-4 mb-6">
                <span className="text-xs text-gray-500 font-bold block mb-2">Productos</span>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-900 mt-4 pt-2 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span className="text-green-600 text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions triggers */}
            <div className="space-y-2 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                {selectedOrder.estado === 'pendiente' && (
                  <>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'aceptado')}
                      variant="success"
                      size="sm"
                      className="w-full text-xs py-2.5 flex items-center justify-center gap-1.5 rounded-md"
                    >
                      <Check className="w-4 h-4" />
                      Aceptar
                    </Button>
                    <Button
                      onClick={() => setConfirmCancelId(selectedOrder.id)}
                      variant="danger"
                      size="sm"
                      className="w-full text-xs py-2.5 flex items-center justify-center gap-1.5 rounded-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Rechazar
                    </Button>
                  </>
                )}
                {selectedOrder.estado === 'aceptado' && (
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completado')}
                    variant="success"
                    size="sm"
                    className="w-full col-span-2 text-xs py-2.5 flex items-center justify-center gap-1.5 rounded-md"
                  >
                    <Check className="w-4 h-4" />
                    Completar Pedido
                  </Button>
                )}
                {selectedOrder.estado === 'completado' && (
                  <div className="col-span-2 text-center text-xs font-bold text-green-600 bg-green-50 py-2.5 rounded-md flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Completado y entregado
                  </div>
                )}
                {selectedOrder.estado === 'cancelado' && (
                  <div className="col-span-2 text-center text-xs font-bold text-red-600 bg-red-50 py-2.5 rounded-md flex items-center justify-center gap-1.5">
                    <X className="w-4 h-4" />
                    Pedido Cancelado
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => handleWhatsAppContact(selectedOrder)}
                variant="secondary"
                size="sm"
                className="w-full text-xs py-2.5 flex items-center justify-center gap-2 border-green-200 hover:bg-green-50 rounded-md"
              >
                <PhoneCall className="w-4 h-4 text-green-600" />
                Contactar WhatsApp
              </Button>
              <Button
                onClick={() => handleExportPDF(selectedOrder)}
                variant="ghost"
                size="sm"
                className="w-full text-xs py-2 flex items-center justify-center gap-2 rounded-md"
              >
                <Printer className="w-4 h-4" />
                Exportar Recibo / Imprimir
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-gray-500 text-sm p-4">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <span>Selecciona un pedido de la lista para ver su información completa y gestionarla.</span>
          </div>
        )}
        <ConfirmDialog
          isOpen={!!confirmCancelId}
          onClose={() => setConfirmCancelId(null)}
          onConfirm={() => {
            updateOrderStatus(confirmCancelId, 'cancelado');
            setConfirmCancelId(null);
          }}
          title="¿Rechazar Pedido?"
          description="¿Estás seguro de que deseas rechazar este pedido? Esto marcará la orden como cancelada de forma permanente."
          type="danger"
          confirmText="Rechazar"
          cancelText="Cancelar"
        />
      </div>

    </div>
  );
}
