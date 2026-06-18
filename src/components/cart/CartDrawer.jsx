import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../ui/Button';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, cartTotal, clearCart, setView } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    setView('checkout');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer container */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tu Carrito</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {cart.length === 0 ? 'Sin artículos' : `${cart.length} productos agregados`}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400 border border-gray-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">El carrito está vacío</h4>
                <p className="text-sm text-gray-400 max-w-[240px]">
                  ¡Agrega algunos productos del catálogo para comenzar tu pedido!
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
                
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 font-bold hover:text-red-700 mt-4 self-end flex items-center gap-1.5 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 font-medium text-sm">Subtotal</span>
                <span className="text-2xl font-black text-green-600">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mb-6">
                Los impuestos y costos de envío se calcularán en el checkout. La compra finaliza de forma humana a través de WhatsApp.
              </p>
              
              <div className="flex flex-col gap-2">
                <Button onClick={handleCheckoutClick} className="w-full">
                  Proceder al Pago
                </Button>
                <Button onClick={onClose} variant="ghost" className="w-full">
                  Seguir comprando
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
