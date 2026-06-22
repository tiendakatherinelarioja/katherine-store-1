import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import Button from '../../components/ui/Button';

import ProductCard from '../../components/product/ProductCard';
import { ChevronLeft, MessageCircle, ShoppingCart, Star, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_WHATSAPP = '5493804918672';

export default function ProductDetail() {
  const { 
    selectedProduct: product, 
    setSelectedProduct, 
    setView, 
    addToCart 
  } = useCart();

  // Load client products for related recommendations
  const { products: allProducts } = useProducts(false);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  // Filter related products (same category, excluding current product, in stock)
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((p) => p.category.toLowerCase() === product.category.toLowerCase() && p.id !== product.id && p.stock > 0)
      .slice(0, 4);
  }, [product, allProducts]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 font-bold mb-4">No se ha seleccionado ningún producto.</p>
        <Button onClick={() => setView('catalog')}>Ir al Catálogo</Button>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    if (product.stock >= quantity) {
      addToCart(product, quantity);
      alert(`¡Agregado al carrito: ${quantity}x ${product.name}!`);
    }
  };

  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
    `¡Hola! Me gustaría realizar una consulta sobre el producto: *${product.name}* (Precio: $${product.price.toFixed(2)})`
  )}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 font-sans text-gray-800"
    >
      {/* Breadcrumb & Back navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <button
          onClick={() => {
            setView('catalog');
            setSelectedProduct(null);
          }}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors focus:outline-none cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Volver al Catálogo
        </button>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
          Inicio / Catálogo / {product.category}
        </span>
      </div>

      {/* Main product column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Container (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="aspect-square bg-gray-50/50 border border-gray-100 rounded-[32px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover select-none"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-md">
                  Sin Stock
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Information & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-zinc-500">
            <span>{product.category}</span>
            <span className="text-gray-300 font-normal select-none">•</span>
            {product.stock === 0 ? (
              <span className="text-red-600">Agotado</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-700">¡Últimas {product.stock} unidades!</span>
            ) : (
              <span className="text-zinc-600">Disponible</span>
            )}
          </div>

          {/* Product Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
              {product.name}
            </h1>
            
            {/* Review and Stars */}
            <div className="flex items-center gap-1.5 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 fill-current ${i < Math.floor(product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`} 
                />
              ))}
              <span className="text-xs font-semibold text-gray-500 ml-1">
                {product.rating || '5.0'} ({product.reviewsCount || 0} valoraciones de clientes)
              </span>
            </div>
          </div>

          {/* Price display */}
          <div className="py-4 border-y border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5 uppercase tracking-widest font-bold">Precio Unitario</span>
              <span className="text-3xl font-extrabold text-zinc-950 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
            </div>
            {product.stock > 0 && (
              <span className="text-xs font-medium text-gray-400">
                Coordinación de stock instantánea
              </span>
            )}
          </div>

          {/* Details / Tabs Panel */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-gray-100 pb-2">
              <button 
                onClick={() => setActiveTab('description')}
                className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'description' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Descripción
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'shipping' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Envío y Retiro
              </button>
            </div>

            <div className="min-h-[80px]">
              {activeTab === 'description' ? (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description || 'Este producto no cuenta con descripción adicional por el momento. Consulta disponibilidad de tonos, tamaños y stock a través de WhatsApp.'}
                </p>
              ) : (
                <p className="text-sm text-gray-500 leading-relaxed">
                  Showroom ubicado en La Rioja - Pelagio B. Luna 619. Realizamos retiros en local coordinados o envíos a domicilio en toda la ciudad. Medios de pago disponibles: Transferencia Bancaria y Efectivo.
                </p>
              )}
            </div>
          </div>

          {/* Purchase Controls */}
          {product.stock > 0 ? (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity selector */}
                <div className="flex items-center justify-between border border-gray-200 rounded-full px-4 py-2 bg-gray-50 gap-6 w-full sm:w-auto shrink-0 select-none">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-gray-500 hover:text-black font-black text-lg focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-extrabold text-gray-900 w-6 text-center font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="text-gray-500 hover:text-black font-black text-lg focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <Button 
                  onClick={handleAddToCartClick} 
                  className="flex-1 py-4 text-xs font-bold uppercase tracking-wider rounded-full justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Añadir al Carrito (${(product.price * quantity).toFixed(2)})
                </Button>
              </div>

              {/* Consultation / Checkout directly */}
              <div className="flex gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full border border-green-500 text-green-600 hover:bg-green-50 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="w-full text-left pl-4 py-3 border-l-2 border-red-500 text-red-650 font-bold uppercase tracking-widest text-xs">
                Agotado temporalmente
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full border border-green-500 text-green-600 hover:bg-green-50 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
                Consultar Ingreso por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Related products recommendations section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-gray-100 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 text-left">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Completa tu Estilo</span>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Productos Relacionados <span className="text-gray-450 font-normal">que te pueden gustar</span>
              </h3>
            </div>
            <button
              onClick={() => {
                setView('catalog');
                setSelectedProduct(null);
              }}
              className="text-xs font-bold text-zinc-950 hover:underline flex items-center gap-1 cursor-pointer focus:outline-none self-start sm:self-center"
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
