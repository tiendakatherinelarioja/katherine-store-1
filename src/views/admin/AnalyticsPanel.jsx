import React, { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../context/CartContext';
import {
  TrendingUp,
  ShoppingBag,
  BarChart2,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  Package,
  FileSpreadsheet,
  UserPlus,
  Users
} from 'lucide-react';

export default function AnalyticsPanel({ products, onTabChange, onCreateAdminClick }) {
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

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1 select-none">
      
      {/* Sección de Accesos Rápidos */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Inventario */}
          <button
            onClick={() => onTabChange('inventory')}
            className="flex flex-col text-left p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 rounded-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mb-3 text-gray-700">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-900 group-hover:text-black transition-colors">Administrar Catálogo</span>
            <span className="text-xs text-gray-500 mt-1">Control de inventario, stock y precios de productos.</span>
          </button>

          {/* Card 2: Pedidos */}
          <button
            onClick={() => onTabChange('orders')}
            className="flex flex-col text-left p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 rounded-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mb-3 text-gray-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-900 group-hover:text-black transition-colors">Gestión de Pedidos</span>
            <span className="text-xs text-gray-500 mt-1">Ver órdenes pendientes, cambiar estados y coordinar WhatsApp.</span>
          </button>

          {/* Card 3: Crear Admin (Only for superadmin) */}
          {userRole === 'superadmin' ? (
            <button
              onClick={onCreateAdminClick}
              className="flex flex-col text-left p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 rounded-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mb-3 text-gray-700">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-gray-900 group-hover:text-black transition-colors">Registrar Administrador</span>
              <span className="text-xs text-gray-500 mt-1">Crear credenciales para un nuevo usuario administrador.</span>
            </button>
          ) : (
            <div className="flex flex-col text-left p-4 border border-gray-150 bg-gray-50/50 rounded-md opacity-60">
              <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center mb-3 text-gray-500">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-gray-500">Usuarios del Sistema</span>
              <span className="text-xs text-gray-500 mt-1">Función restringida. Solo disponible para rol superadmin.</span>
            </div>
          )}

        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total revenue */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Facturación Total</span>
            <span className="text-2xl font-black text-gray-900">${stats.totalSales.toFixed(2)}</span>
            <span className="text-[10px] text-green-500 font-bold block mt-0.5">Excluye cancelados</span>
          </div>
        </div>

        {/* Orders Count */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Pedidos Efectivos</span>
            <span className="text-2xl font-black text-gray-900">{stats.ordersCount}</span>
            <span className="text-[10px] text-blue-500 font-bold block mt-0.5">Aceptados y completados</span>
          </div>
        </div>

        {/* Average value */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Ticket Promedio</span>
            <span className="text-2xl font-black text-gray-900">${stats.averageValue.toFixed(2)}</span>
            <span className="text-[10px] text-purple-500 font-bold block mt-0.5">Valor promedio por orden</span>
          </div>
        </div>

      </div>

      {/* Grid of chart and list details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category breakdown */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200/80">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            <h3 className="text-base font-bold text-gray-900">Ventas por Categoría</h3>
          </div>
          
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              Crea pedidos en checkout para ver estadísticas por categoría.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((cat, idx) => {
                const percent = ((cat.value / maxCategoryValue) * 100).toFixed(0);
                const colorClass = 
                  idx % 3 === 0 ? 'bg-green-500' :
                  idx % 3 === 1 ? 'bg-blue-500' : 'bg-purple-500';

                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-900">${cat.value.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-sm h-3 overflow-hidden">
                      <div 
                        style={{ width: `${percent}%` }}
                        className={`${colorClass} h-full rounded-sm transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inventory report summary */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200/80">
              <ClipboardListIcon className="w-5 h-5 text-gray-500" />
              <h3 className="text-base font-bold text-gray-900">Resumen de Inventario</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                <span className="text-gray-500 font-medium">Tipos de Productos</span>
                <span className="font-bold text-gray-900">{products.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                <span className="text-gray-500 font-medium">Stock Total de Artículos</span>
                <span className="font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.stock, 0)} unidades
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                <span className="text-gray-500 font-medium">Productos Sin Stock (Agotados)</span>
                <span className={`font-bold flex items-center gap-1.5 ${products.filter(p => p.stock === 0).length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {products.filter(p => p.stock === 0).length > 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {products.filter(p => p.stock === 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 font-medium">Productos con Stock Crítico (Menor o igual a 5)</span>
                <span className={`font-bold ${products.filter(p => p.stock > 0 && p.stock <= 5).length > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                  {products.filter(p => p.stock > 0 && p.stock <= 5).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/80 p-4 rounded-md border border-gray-200/80 mt-6 text-xs text-gray-500 flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <span>
              <strong>Recomendación:</strong> Reponer el stock de los productos agotados o críticos para evitar quiebres de venta en la derivación por WhatsApp.
            </span>
          </div>
        </div>

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
