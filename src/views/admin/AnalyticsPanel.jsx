import React, { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../context/CartContext';
import {
  TrendingUp,
  ShoppingBag,
  BarChart2,
  DollarSign,
  Package,
  FileSpreadsheet,
  RefreshCw,
  Layers
} from 'lucide-react';

export default function AnalyticsPanel({ products, onTabChange }) {
  const { orders, fetchOrders } = useOrders();
  const { userRole } = useCart();
  const [stats, setStats] = useState({
    totalSales: 0,
    ordersCount: 0,
    averageValue: 0,
    categorySales: {}
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Calculate stats
    const total = orders.reduce((sum, o) => sum + (o.estado !== 'cancelado' ? o.total : 0), 0);
    const count = orders.filter(o => o.estado !== 'cancelado').length;
    const avg = count > 0 ? total / count : 0;

    // Calculate category distribution based on order items
    const catSales = {};
    orders.forEach(o => {
      if (o.estado === 'cancelado') return;
      o.items.forEach(item => {
        // Find category from products database
        const prod = products.find(p => p.id === item.id || p.name === item.name);
        const category = prod ? prod.category : 'Otros';
        const subtotal = item.price * item.quantity;
        
        catSales[category] = (catSales[category] || 0) + subtotal;
      });
    });

    setStats({
      totalSales: total,
      ordersCount: count,
      averageValue: avg,
      categorySales: catSales
    });
  }, [orders, products]);

  // Convert category stats to array for sorting/display
  const categoryData = Object.entries(stats.categorySales).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  const maxCategoryValue = Math.max(...categoryData.map(c => c.value), 1);

  // Calculate best selling products
  const bestSellers = React.useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      if (o.estado === 'cancelado') return;
      o.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const maxBestSellerQuantity = React.useMemo(() => {
    return Math.max(...bestSellers.map(s => s.quantity), 1);
  }, [bestSellers]);

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1 select-none">
      
      {/* Sección de Accesos Rápidos */}
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Inventario */}
          <button
            onClick={() => onTabChange('inventory')}
            className="flex flex-col text-left p-5 border border-gray-150 hover:border-zinc-300 hover:bg-gray-50/30 rounded-xl hover:-translate-y-0.5 hover:shadow-sm active:scale-98 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3.5 text-violet-600 transition-all group-hover:scale-105">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-900 group-hover:text-black transition-colors">Administrar Catálogo</span>
            <span className="text-xs text-gray-500 mt-1.5 leading-relaxed">Control de inventario, stock y precios de productos.</span>
          </button>

          {/* Card 2: Pedidos */}
          <button
            onClick={() => onTabChange('orders')}
            className="flex flex-col text-left p-5 border border-gray-150 hover:border-zinc-300 hover:bg-gray-50/30 rounded-xl hover:-translate-y-0.5 hover:shadow-sm active:scale-98 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-3.5 text-sky-600 transition-all group-hover:scale-105">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-900 group-hover:text-black transition-colors">Gestión de Pedidos</span>
            <span className="text-xs text-gray-500 mt-1.5 leading-relaxed">Ver órdenes pendientes, cambiar estados y coordinar WhatsApp.</span>
          </button>

        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total revenue */}
        <div className="bg-linear-to-tr from-emerald-50/50 to-teal-50/20 p-6 rounded-xl border border-emerald-100 shadow-xs hover:-translate-y-1 hover:shadow-sm transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-800 block">Facturación Total</span>
            <span className="text-2xl font-black text-emerald-950">${stats.totalSales.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Excluye cancelados</span>
          </div>
        </div>

        {/* Orders Count */}
        <div className="bg-linear-to-tr from-sky-50/50 to-blue-50/20 p-6 rounded-xl border border-sky-100 shadow-xs hover:-translate-y-1 hover:shadow-sm transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-sky-800 block">Pedidos Efectivos</span>
            <span className="text-2xl font-black text-sky-950">{stats.ordersCount}</span>
            <span className="text-[10px] text-sky-600 font-bold block mt-0.5">Aceptados y completados</span>
          </div>
        </div>

        {/* Average value */}
        <div className="bg-linear-to-tr from-purple-50/50 to-pink-50/20 p-6 rounded-xl border border-purple-100 shadow-xs hover:-translate-y-1 hover:shadow-sm transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-sm shadow-purple-500/20">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-purple-800 block">Ticket Promedio</span>
            <span className="text-2xl font-black text-purple-950">${stats.averageValue.toFixed(2)}</span>
            <span className="text-[10px] text-purple-600 font-bold block mt-0.5">Valor promedio por orden</span>
          </div>
        </div>

      </div>

      {/* Grid of chart and list details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Category breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200/80">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h3 className="text-base font-bold text-gray-900">Ventas por Categoría</h3>
          </div>
          
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-gray-450 text-xs">
              Crea pedidos en checkout para ver estadísticas por categoría.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((cat, idx) => {
                const percent = ((cat.value / maxCategoryValue) * 100).toFixed(0);
                const barColor = 
                  idx % 3 === 0 ? 'bg-linear-to-r from-emerald-400 to-teal-500' :
                  idx % 3 === 1 ? 'bg-linear-to-r from-sky-400 to-indigo-500' : 
                                  'bg-linear-to-r from-purple-400 to-pink-500';

                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-900">${cat.value.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-100/80 rounded-full h-2 overflow-hidden border border-gray-50">
                      <div 
                        style={{ width: `${percent}%` }}
                        className={`${barColor} h-full rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inventory report summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200/80">
              <ClipboardListIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-base font-bold text-gray-900">Resumen de Inventario</h3>
            </div>
            
            <div className="space-y-4 text-xs font-bold text-gray-700">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                <span className="text-gray-550 font-semibold">Tipos de Productos</span>
                <span className="text-gray-900 font-extrabold">{products.length}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                <span className="text-gray-550 font-semibold">Stock Total de Artículos</span>
                <span className="text-gray-900 font-extrabold">
                  {products.reduce((sum, p) => sum + p.stock, 0)} unidades
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                <span className="text-gray-550 font-semibold">Productos Sin Stock (Agotados)</span>
                <span className={`flex items-center gap-1.5 ${products.filter(p => p.stock === 0).length > 0 ? 'text-red-600 font-black' : 'text-gray-900 font-extrabold'}`}>
                  {products.filter(p => p.stock === 0).length > 0 && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                  {products.filter(p => p.stock === 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-gray-550 font-semibold">Productos con Stock Crítico (Menor o igual a 5)</span>
                <span className={`${products.filter(p => p.stock > 0 && p.stock <= 5).length > 0 ? 'text-amber-600 font-black' : 'text-gray-900 font-extrabold'}`}>
                  {products.filter(p => p.stock > 0 && p.stock <= 5).length}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Best Sellers Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 mt-6 text-left">
        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200/80">
          <ShoppingBag className="w-5 h-5 text-gray-400" />
          <h3 className="text-base font-bold text-gray-900">Productos más Vendidos</h3>
        </div>
        
        {bestSellers.length === 0 ? (
          <div className="text-center py-12 text-gray-450 text-xs">
            No hay suficientes ventas registradas para generar este reporte.
          </div>
        ) : (
          <div className="space-y-4.5">
            {bestSellers.map((item, idx) => {
              const percent = ((item.quantity / maxBestSellerQuantity) * 100).toFixed(0);
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200/50 flex items-center justify-center text-[10px] text-zinc-700 font-extrabold">
                        {idx + 1}
                      </span>
                      {item.name}
                    </span>
                    <span className="text-gray-950 font-extrabold">{item.quantity} unidades</span>
                  </div>
                  <div className="w-full bg-gray-100/85 rounded-full h-2.5 overflow-hidden border border-gray-50">
                    <div 
                      style={{ width: `${percent}%` }}
                      className="bg-linear-to-r from-zinc-700 to-zinc-900 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

// Internal small helper to keep icon definitions clean
function ClipboardListIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
