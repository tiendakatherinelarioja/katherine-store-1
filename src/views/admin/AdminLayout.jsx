import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../services/supabaseClient';
import OrdersPanel from './OrdersPanel';
import InventoryPanel from './InventoryPanel';
import AnalyticsPanel from './AnalyticsPanel';
import CategoryPanel from './CategoryPanel';
import AnnouncementsPanel from './AnnouncementsPanel';
import CouponPanel from './CouponPanel';
import { useCategories } from '../../hooks/useCategories';
import {
  ShieldCheck,
  ChevronDown,
  Package,
  FileSpreadsheet,
  TrendingUp,
  LogOut,
  Plus,
  Monitor,
  Users,
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  Menu,
  Layers,
  Tag
} from 'lucide-react';

export default function AdminLayout({
  products,
  updateProductStock,
  updateProductPrice,
  addProduct,
  editProduct,
  deleteProduct
}) {
  const { adminTab, setAdminTab, logoutAdmin, userRole, setView } = useCart();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const {
    categories,
    categoriesList,
    subcategoriesList,
    loading: loadingCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
  } = useCategories();



  const toggleDropdown = (menu) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menu);
    }
  };

  const handleMenuSelection = (tab) => {
    setAdminTab(tab);
    setOpenDropdown(null);
  };



  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-gray-100/60 flex flex-col md:flex-row font-jakarta overflow-hidden">
      
      {/* Mobile Top Navigation bar */}
      <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1.5">
          {!logoError ? (
            <img 
              src="/logo.png" 
              alt="Logo" 
              onError={() => setLogoError(true)} 
              className="h-6 w-auto object-contain"
            />
          ) : (
            <>
              <span className="text-green-600 font-extrabold text-sm">●</span>
              <span className="font-black text-xs uppercase tracking-wider text-gray-900">Katherine admin</span>
            </>
          )}
        </div>
        <div className="w-10"></div> {/* Spacer to center the title */}
      </div>

      {/* Sidebar Navigation (Desktop visible, Mobile sliding drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Sidebar Header */}
          <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  onError={() => setLogoError(true)} 
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <>
                  <span className="text-zinc-950 font-extrabold text-lg">●</span>
                  <span className="font-black text-sm uppercase tracking-wider text-gray-900">Katherine admin</span>
                </>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            
            {/* Volver a la Tienda (Home) */}
            <button
              onClick={() => {
                setView('home');
                setIsSidebarOpen(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Home className="w-4 h-4 text-gray-400" />
              Tienda (Home)
            </button>

            <div className="h-px bg-gray-100 my-2" />

            {/* Estadísticas */}
            <button
              onClick={() => {
                handleMenuSelection('analytics');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 cursor-pointer ${
                adminTab === 'analytics'
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10 scale-[1.01] translate-x-0.5'
                  : 'text-gray-650 hover:bg-gray-50/80 hover:text-gray-950'
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${adminTab === 'analytics' ? 'text-white' : 'text-gray-400'}`} />
              Estadísticas
            </button>

            {/* Catálogo */}
            <button
              onClick={() => {
                handleMenuSelection('inventory');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 cursor-pointer ${
                adminTab === 'inventory'
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10 scale-[1.01] translate-x-0.5'
                  : 'text-gray-650 hover:bg-gray-50/80 hover:text-gray-950'
              }`}
            >
              <Package className={`w-4 h-4 ${adminTab === 'inventory' ? 'text-white' : 'text-gray-400'}`} />
              Catálogo
            </button>

            {/* Categorías */}
            <button
              onClick={() => {
                handleMenuSelection('categories');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 cursor-pointer ${
                adminTab === 'categories'
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10 scale-[1.01] translate-x-0.5'
                  : 'text-gray-650 hover:bg-gray-50/80 hover:text-gray-950'
              }`}
            >
              <Layers className={`w-4 h-4 ${adminTab === 'categories' ? 'text-white' : 'text-gray-400'}`} />
              Categorías
            </button>

            {/* Pedidos */}
            <button
              onClick={() => {
                handleMenuSelection('orders');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10 scale-[1.01] translate-x-0.5'
                  : 'text-gray-650 hover:bg-gray-50/80 hover:text-gray-950'
              }`}
            >
              <FileSpreadsheet className={`w-4 h-4 ${adminTab === 'orders' ? 'text-white' : 'text-gray-400'}`} />
              Pedidos
            </button>

            {/* Anuncios */}
            <button
              onClick={() => {
                handleMenuSelection('announcements');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 cursor-pointer ${
                adminTab === 'announcements'
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10 scale-[1.01] translate-x-0.5'
                  : 'text-gray-650 hover:bg-gray-50/80 hover:text-gray-950'
              }`}
            >
              <Monitor className={`w-4 h-4 ${adminTab === 'announcements' ? 'text-white' : 'text-gray-400'}`} />
              Anuncios Hero
            </button>

            {/* Cupones */}
            <button
              onClick={() => {
                handleMenuSelection('coupons');
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 cursor-pointer ${
                adminTab === 'coupons'
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10 scale-[1.01] translate-x-0.5'
                  : 'text-gray-650 hover:bg-gray-50/80 hover:text-gray-950'
              }`}
            >
              <Tag className={`w-4 h-4 ${adminTab === 'coupons' ? 'text-white' : 'text-gray-400'}`} />
              Cupones
            </button>

            {/* Crear Administrador */}
            {userRole === 'superadmin' && (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <button
                  onClick={() => {
                    setIsCreateAdminOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01] hover:translate-x-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  Crear Administrador
                </button>
              </>
            )}

          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={logoutAdmin}
            className="w-full px-4 py-2.5 bg-white border border-gray-250 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Content Panels */}
      <main className="flex-1 overflow-hidden p-4 md:p-8 relative flex flex-col justify-stretch">
        {adminTab === 'orders' && <OrdersPanel />}
        {adminTab === 'announcements' && <AnnouncementsPanel />}
        {adminTab === 'coupons' && <CouponPanel />}
        
        {adminTab === 'inventory' && (
          <InventoryPanel
            products={products}
            updateProductStock={updateProductStock}
            updateProductPrice={updateProductPrice}
            addProduct={addProduct}
            editProduct={editProduct}
            deleteProduct={deleteProduct}
            isAddProductOpen={isAddProductOpen}
            setIsAddProductOpen={setIsAddProductOpen}
            categories={categories}
            categoriesList={categoriesList}
            subcategoriesList={subcategoriesList}
          />
        )}
        
        {adminTab === 'analytics' && (
          <AnalyticsPanel
            products={products}
            onTabChange={handleMenuSelection}
          />
        )}

        {adminTab === 'categories' && (
          <CategoryPanel
            products={products}
            categories={categories}
            categoriesList={categoriesList}
            subcategoriesList={subcategoriesList}
            loadingCategories={loadingCategories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            addSubcategory={addSubcategory}
            updateSubcategory={updateSubcategory}
            deleteSubcategory={deleteSubcategory}
          />
        )}
      </main>



    </div>
  );
}
