import React from 'react';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, nombre, precio, imagen_url, cantidad } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 items-center">
      {/* Product Image */}
      <img
        src={imagen_url}
        alt={nombre}
        className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
      />

      {/* Info details */}
      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-sm text-gray-900 truncate">{nombre}</h5>
        <span className="text-xs text-gray-400 block mb-1">Producto</span>
        
        {/* Quantity Controls and Price */}
        <div className="flex items-center justify-between mt-2">
          {/* Controls */}
          <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 gap-3 bg-gray-50">
            <button
              onClick={() => updateQuantity(id, cantidad - 1)}
              className="text-gray-500 hover:text-black font-semibold text-sm px-1.5 focus:outline-none"
            >
              -
            </button>
            <span className="text-xs font-bold text-gray-900 w-4 text-center">{cantidad}</span>
            <button
              onClick={() => updateQuantity(id, cantidad + 1)}
              className="text-gray-500 hover:text-black font-semibold text-sm px-1.5 focus:outline-none"
            >
              +
            </button>
          </div>
          
          <span className="text-sm font-extrabold text-zinc-950 tracking-tight">
            ${(precio * cantidad).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
        title="Quitar del carrito"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
