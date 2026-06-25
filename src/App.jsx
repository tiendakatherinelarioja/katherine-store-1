import React, { useState, useEffect, lazy, Suspense } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { useProducts } from './hooks/useProducts';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

// Navigation Components
import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';

// UI and Cart Components
import CartDrawer from './components/cart/CartDrawer';
import AuthModal from './components/ui/AuthModal';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';

// Views
import Home from './views/client/Home';
import Catalog from './views/client/Catalog';
import Checkout from './views/client/Checkout';
import Login from './views/client/Login';
import HowToBuy from './views/client/HowToBuy';
import Contact from './views/client/Contact';
import MyOrders from './views/client/MyOrders';
import MyAccount from './views/client/MyAccount';
import ProductDetail from './views/client/ProductDetail';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = lazy(() => import('./views/admin/AdminLayout'));

function AppContent() {
  const { view, setView, selectedProduct, setSelectedProduct, addToCart, userRole, checkingAuth } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalQty, setModalQty] = useState(1);

  // Enforce access control to the Admin Panel
  useEffect(() => {
    if (view === 'admin' && !checkingAuth) {
      if (userRole !== 'admin' && userRole !== 'superadmin') {
        setView('login');
      }
    }
  }, [view, userRole, checkingAuth, setView]);

  // Load client-facing active products (optimized view)
  const {
    products: clientProducts,
    loading: clientProductsLoading,
    error: clientProductsError
  } = useProducts(false);

  // Load admin full product list (including out-of-stock items)
  // Se optimiza para no cargar los productos de admin si no estamos en la vista admin
  const {
    products: adminProducts,
    updateProductStock,
    updateProductPrice,
    addProduct,
    editProduct,
    deleteProduct
  } = useProducts(true, view === 'admin');

  const handleModalAddToCart = () => {
    if (selectedProduct && selectedProduct.stock >= modalQty) {
      addToCart(selectedProduct, modalQty);
      setSelectedProduct(null);
      setModalQty(1);
      setIsCartOpen(true); // Open cart to show item added
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header Navigation (Hidden in admin layout for pure full screen experience) */}
      {view !== 'admin' && <Navbar onCartOpen={() => setIsCartOpen(true)} />}

      {/* 2. Main content pages */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {view === 'home' && (
              clientProductsLoading ? (
                <div className="flex justify-center items-center py-20"><span className="text-gray-500 font-bold animate-pulse">Cargando catálogo...</span></div>
              ) : clientProductsError ? (
                <div className="text-center py-20 text-red-500 font-bold">{clientProductsError}</div>
              ) : (
                <Home products={clientProducts} />
              )
            )}
            {view === 'catalog' && (
              clientProductsLoading ? (
                <div className="flex justify-center items-center py-20"><span className="text-gray-500 font-bold animate-pulse">Cargando catálogo...</span></div>
              ) : clientProductsError ? (
                <div className="text-center py-20 text-red-500 font-bold">{clientProductsError}</div>
              ) : (
                <Catalog products={clientProducts} />
              )
            )}
            {view === 'product-detail' && <ProductDetail />}
            {view === 'checkout' && <Checkout />}
            {view === 'login' && <Login />}
            {view === 'howtobuy' && <HowToBuy />}
            {view === 'contact' && <Contact />}
            {view === 'myorders' && <MyOrders />}
            {view === 'myaccount' && <MyAccount />}
            {view === 'admin' && (userRole === 'admin' || userRole === 'superadmin') && (
              <Suspense fallback={
                <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center font-jakarta">
                  <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-zinc-950 animate-spin mb-4" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cargando Panel...</span>
                </div>
              }>
                <AdminLayout
                  products={adminProducts}
                  updateProductStock={updateProductStock}
                  updateProductPrice={updateProductPrice}
                  addProduct={addProduct}
                  editProduct={editProduct}
                  deleteProduct={deleteProduct}
                />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer (Hidden in admin view for clean desktop appearance) */}
      {view !== 'admin' && <Footer />}

      {/* 4. Sliding Cart Drawer Overlay */}
      {view !== 'admin' && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}

      {/* 5. Customer Auth Modal */}
      {view !== 'admin' && <AuthModal />}



      {/* 6. Floating WhatsApp Button */}
      {view !== 'admin' && <FloatingWhatsApp />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
