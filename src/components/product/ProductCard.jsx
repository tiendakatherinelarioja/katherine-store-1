import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Badge from '../ui/Badge';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, setView } = useCart();
  const [liked, setLiked] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Avoid triggering details navigation
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image and Overlay Tags */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden relative aspect-[4/5] mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md text-red-500 transition-transform active:scale-90"
        >
          <svg
            className="w-5 h-5"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Stock Badge Overlay */}
        {product.stock === 0 ? (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
              Sin Stock
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning">¡Últimas {product.stock} unidades!</Badge>
          </div>
        ) : null}

        {/* Category Overlay Tag */}
        <div className="absolute top-4 left-4">
          <Badge variant="info" className="opacity-90">
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Info details */}
      <div className="flex-1 flex flex-col px-2">
        <h4 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-zinc-600 transition-colors">
          {product.name}
        </h4>
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">
          {product.description || 'Descripción no disponible'}
        </p>

        {/* Price, Stars and Add to Cart Section */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-zinc-950 tracking-tight text-base">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-gray-700">
                {product.rating || '5.0'} ({product.reviewsCount || 0})
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-black active:scale-[0.98]'
            }`}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
