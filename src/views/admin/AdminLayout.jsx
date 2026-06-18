import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../services/supabaseClient';
import OrdersPanel from './OrdersPanel';
import InventoryPanel from './InventoryPanel';
import AnalyticsPanel from './AnalyticsPanel';
import CategoryPanel from './CategoryPanel';
import AnnouncementsPanel from './AnnouncementsPanel';
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
  Layers
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
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const {
    categories,
    categoriesList,
    loading: loadingCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  // States for user creation
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [createAdminStatus, setCreateAdminStatus] = useState(null); // { type: 'success' | 'error', message: string } | null

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

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      setCreateAdminStatus({
        type: 'error',
        message: 'Por favor, completa todos los campos.'
      });
      return;
    }
    if (adminPassword.length < 6) {
      setCreateAdminStatus({
        type: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
      return;
    }

    setCreateAdminLoading(true);
    setCreateAdminStatus(null);

    try {
      const { data, error } = await supabase.rpc('crear_usuario_admin', {
        new_email: adminEmail.trim(),
        new_password: adminPassword
      });

      if (error) throw error;

      setCreateAdminStatus({
        type: 'success',
        message: 'El usuario administrador ha sido creado exitosamente.'
      });
      setAdminEmail('');
      setAdminPassword('');
    } catch (err) {
      console.error('Error al crear administrador:', err);
      setCreateAdminStatus({
        type: 'error',
        message: err.message || 'Error al intentar crear el usuario administrador.'
      });
    } finally {
      setCreateAdminLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-gray-100/60 flex font-sans overflow-hidden">
      
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
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                adminTab === 'analytics'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                adminTab === 'inventory'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                adminTab === 'categories'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
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
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                adminTab === 'announcements'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              }`}
            >
              <Monitor className={`w-4 h-4 ${adminTab === 'announcements' ? 'text-white' : 'text-gray-400'}`} />
              Anuncios Hero
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
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
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
            className="w-full px-4 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
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
      <main className="flex-1 overflow-hidden p-6 md:p-8 relative mt-14 md:mt-0 flex flex-col justify-stretch">
        {adminTab === 'orders' && <OrdersPanel />}
        {adminTab === 'announcements' && <AnnouncementsPanel />}
        
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
          />
        )}
        
        {adminTab === 'analytics' && (
          <AnalyticsPanel
            products={products}
            onTabChange={handleMenuSelection}
            onCreateAdminClick={() => setIsCreateAdminOpen(true)}
          />
        )}

        {adminTab === 'categories' && (
          <CategoryPanel
            products={products}
            categories={categories}
            categoriesList={categoriesList}
            loadingCategories={loadingCategories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        )}
      </main>

      {/* 3. Modal: Crear Administrador (Only for superadmin) */}
      {isCreateAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-md shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm uppercase tracking-wide">Crear Nuevo Administrador</h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateAdminOpen(false);
                  setCreateAdminStatus(null);
                }}
                className="p-1 rounded-sm hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              
              {createAdminStatus && (
                <div
                  className={`p-4 rounded-md flex items-start gap-3 text-xs font-semibold ${
                    createAdminStatus.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-100'
                      : 'bg-red-50 text-red-800 border border-red-100'
                  }`}
                >
                  {createAdminStatus.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{createAdminStatus.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@katherine.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={createAdminLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Contraseña Temporal
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={createAdminLoading}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateAdminOpen(false);
                    setCreateAdminStatus(null);
                  }}
                  className="px-4 py-2.5 rounded-md border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors"
                  disabled={createAdminLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createAdminLoading}
                  className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {createAdminLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Crear Admin
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
