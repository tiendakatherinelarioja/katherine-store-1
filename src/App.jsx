import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { useProducts } from './hooks/useProducts';

// Navigation Components
import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';

// UI and Cart Components
import CartDrawer from './components/cart/CartDrawer';
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
import AdminLayout from './views/admin/AdminLayout';

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
  const {
    products: adminProducts,
    updateProductStock,
    updateProductPrice,
    addProduct,
    editProduct,
    deleteProduct
  } = useProducts(view === 'admin');

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
      <main className="flex-1">
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
        {view === 'checkout' && <Checkout />}
        {view === 'login' && <Login />}
        {view === 'howtobuy' && <HowToBuy />}
        {view === 'contact' && <Contact />}
        {view === 'admin' && (userRole === 'admin' || userRole === 'superadmin') && (
          <AdminLayout
            products={adminProducts}
            updateProductStock={updateProductStock}
            updateProductPrice={updateProductPrice}
            addProduct={addProduct}
            editProduct={editProduct}
            deleteProduct={deleteProduct}
          />
        )}
      </main>

      {/* 3. Footer (Hidden in admin view for clean desktop appearance) */}
      {view !== 'admin' && <Footer />}

      {/* 4. Sliding Cart Drawer Overlay */}
      {view !== 'admin' && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}

      {/* 5. Product Details Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setModalQty(1);
        }}
        title="Detalles del Producto"
      >
        {selectedProduct && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Image column */}
            <div className="md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Information column */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="info">{selectedProduct.category}</Badge>
                  {selectedProduct.stock === 0 ? (
                    <Badge variant="danger">Agotado</Badge>
                  ) : selectedProduct.stock <= 5 ? (
                    <Badge variant="warning">¡Último stock!</Badge>
                  ) : (
                    <Badge variant="success">Disponible</Badge>
                  )}
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h4>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs font-semibold text-gray-500 ml-1">
                    {selectedProduct.rating || '5.0'} ({selectedProduct.reviewsCount || 0} valoraciones)
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {selectedProduct.description || 'Este producto no cuenta con descripción adicional por el momento.'}
                </p>
              </div>

              {/* Price and Cart controls */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-xs font-medium">Precio unitario</span>
                  <span className="text-2xl font-black text-green-600">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>

                {selectedProduct.stock > 0 ? (
                  <div className="flex gap-3">
                    {/* Qty Selector */}
                    <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 bg-gray-50 gap-4">
                      <button
                        onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                        className="text-gray-500 hover:text-black font-extrabold text-base focus:outline-none"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-gray-900 w-4 text-center">{modalQty}</span>
                      <button
                        onClick={() => setModalQty(Math.min(selectedProduct.stock, modalQty + 1))}
                        disabled={modalQty >= selectedProduct.stock}
                        className={`font-extrabold text-base focus:outline-none ${
                          modalQty >= selectedProduct.stock ? 'text-gray-300' : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <Button onClick={handleModalAddToCart} className="flex-1 py-3 text-xs">
                      Añadir al Carrito (${(selectedProduct.price * modalQty).toFixed(2)})
                    </Button>
                  </div>
                ) : (
                  <div className="w-full text-center py-3 bg-red-50 text-red-600 font-bold rounded-2xl text-sm border border-red-100">
                    Producto Agotado temporalmente
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
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
