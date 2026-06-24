import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Heart } from 'lucide-react';
import Badge from '../ui/Badge';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, setView } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
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
      className="group cursor-pointer flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-charcoal/5 transition-all duration-500 transform hover:-translate-y-1.5"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-alabaster overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Like Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3.5 right-3.5 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Status badges */}
        {product.stock === 0 ? (
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-white text-charcoal text-xs font-extrabold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
              Sin Stock
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning">¡Últimas {product.stock}!</Badge>
          </div>
        ) : null}

        {/* Category Tag */}
        <div className="absolute top-3.5 left-3.5">
          <Badge variant="info" className="backdrop-blur-sm">{product.category}</Badge>
        </div>

        {/* Add to cart CTA — always visible on mobile, slides up on hover on desktop */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-400 ease-out p-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-charcoal text-white hover:bg-black active:scale-[0.98]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock === 0 ? 'Agotado' : added ? '¡Agregado!' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4 pb-5">
        <div>
          <h4 className="font-bold text-charcoal text-sm leading-snug line-clamp-1 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h4>
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
            {product.description || 'Descripción no disponible'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-extrabold text-charcoal tracking-tight text-lg">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] font-semibold text-gray-500">
              {product.rating || '5.0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
