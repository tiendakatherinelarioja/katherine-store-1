import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../hooks/useOrders';
import { useCoupons } from '../../hooks/useCoupons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Default WhatsApp Number for Administrator (Can be customized)
const ADMIN_WHATSAPP = '5493804918672'; 

export default function Checkout() {
  const { cart, cartTotal, setView, user, setIsAuthModalOpen, setAuthModalTab } = useCart();
  const { checkoutAsGuest, loading: checkoutLoading } = useOrders();
  const { validateCoupon } = useCoupons();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    metodoPago: 'efectivo',
    metodoEnvio: 'retiro',
  });

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      const parts = (user.user_metadata?.nombre || user.user_metadata?.full_name || '').split(' ');
      const name = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        nombre: user.user_metadata?.nombre || name || prev.nombre,
        apellido: user.user_metadata?.apellido || lastName || prev.apellido,
        telefono: user.user_metadata?.telefono || prev.telefono,
        email: user.email || prev.email,
        direccion: user.user_metadata?.direccion || prev.direccion,
      }));
    }
  }, [user]);
  const [errors, setErrors] = useState({});

  // Coupon promo states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  const handleApplyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) return;
    const res = await validateCoupon(couponCode);
    if (res.success) {
      setAppliedCoupon(res.coupon);
      setCouponCode('');
    } else {
      setCouponError(res.error);
      setAppliedCoupon(null);
    }
  };

  const discountAmount = appliedCoupon
    ? (appliedCoupon.tipo === 'porcentaje'
        ? cartTotal * (parseFloat(appliedCoupon.valor) / 100)
        : parseFloat(appliedCoupon.valor))
    : 0;

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400 border border-gray-100 mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes productos en tu carrito</h3>
        <p className="text-gray-500 text-sm mb-6">
          Agrega productos en el catálogo antes de proceder al pago.
        </p>
        <Button onClick={() => setView('catalog')}>Ir al Catálogo</Button>
      </div>
    );
  }

  const validate = () => {
    const tempErrors = {};
    if (!formData.nombre.trim()) {
      tempErrors.nombre = 'El nombre es obligatorio.';
    }
    if (!formData.apellido.trim()) {
      tempErrors.apellido = 'El apellido es obligatorio.';
    }
    
    const cleanPhone = formData.telefono.trim();
    if (!cleanPhone) {
      tempErrors.telefono = 'El teléfono es obligatorio.';
    } else if (cleanPhone.length < 6) {
      tempErrors.telefono = 'El teléfono debe tener al menos 6 dígitos.';
    }
    
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        tempErrors.email = 'El formato de email no es válido.';
      }
    }
    
    if (!formData.direccion.trim() && formData.metodoEnvio === 'envio') {
      tempErrors.direccion = 'La dirección de envío es obligatoria.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    let sanitizedValue = value;

    if (field === 'nombre' || field === 'apellido') {
      sanitizedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]/g, '').slice(0, 50);
    } else if (field === 'telefono') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 30);
    } else if (field === 'email') {
      sanitizedValue = value.replace(/[^a-zA-Z0-9@._+-]/g, '').slice(0, 100);
    } else if (field === 'direccion') {
      sanitizedValue = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s,./#°º-]/g, '').slice(0, 150);
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 1. Generate text for WhatsApp redirect
    let message = `*Nuevo Pedido - Katherine Store* ✨\n\n`;
    message += `*Datos del Cliente:*\n`;
    message += `• *Cliente:* ${formData.nombre} ${formData.apellido}\n`;
    message += `• *Teléfono:* ${formData.telefono}\n`;
    if (formData.email) message += `• *Email:* ${formData.email}\n`;
    message += `• *Método de Envío:* ${formData.metodoEnvio === 'envio' ? 'Envío a Domicilio' : 'Retiro en Local'}\n`;
    if (formData.metodoEnvio === 'envio') message += `• *Dirección:* ${formData.direccion}\n`;
    message += `• *Método de Pago:* ${formData.metodoPago === 'transferencia' ? 'Transferencia Bancaria' : formData.metodoPago === 'tarjeta' ? 'Tarjeta de Débito/Crédito' : 'Efectivo'}\n\n`;
    
    message += `*Detalle de Compra:*\n`;
    cart.forEach((item) => {
      message += `• *${item.cantidad}x* ${item.nombre} (_$${item.precio.toFixed(2)} c/u_) -> Subtotal: *$${(item.precio * item.cantidad).toFixed(2)}*\n`;
    });
    
    if (appliedCoupon) {
      message += `\n🎟️ *Cupón Aplicado:* ${appliedCoupon.codigo} (-$${discountAmount.toFixed(2)})\n`;
    }
    
    message += `\n*Total a Coordinar:* *$${finalTotal.toFixed(2)}*`;

    // 2. Call Supabase RPC transaction hook
    // Pass coupon detail in customer payload for audit
    const submissionData = {
      ...formData,
      cupon_codigo: appliedCoupon ? appliedCoupon.codigo : null,
      descuento: discountAmount,
      total_con_descuento: finalTotal
    };
    
    const res = await checkoutAsGuest(submissionData, cart);

    if (res.success) {
      // Save phone number for automatic tracking
      if (formData.telefono) {
        localStorage.setItem('katherine_client_phone', formData.telefono.trim());
      }

      // 3. Open WhatsApp Web / App
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // 4. Redirect client
      alert('¡Tu pedido ha sido registrado con éxito en nuestro sistema! Te estamos redirigiendo a WhatsApp para coordinar el pago.');
      setView('myorders');
    } else {
      alert('Error al registrar pedido en la base de datos: ' + res.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finalizar Pedido</h1>
        <p className="text-gray-500 text-sm">
          Completa tus datos y finaliza la compra vía WhatsApp con atención personalizada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs">
          
          {/* User Auth Banners */}
          {!user ? (
            <div className="border-b border-gray-100 pb-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500">
              <div>
                <span className="font-bold text-zinc-900 block mb-0.5">¿Ya tenés una cuenta?</span>
                <p>Iniciá sesión para completar tus datos de envío automáticamente y guardar tu compra.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-zinc-950 font-bold hover:underline bg-transparent border-0 cursor-pointer text-xs"
              >
                Iniciar Sesión &rarr;
              </button>
            </div>
          ) : (
            <div className="border-b border-gray-100 pb-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500">
              <div>
                <span className="font-bold text-zinc-900 block mb-0.5">Conectado como {user.user_metadata?.nombre || user.email}</span>
                <p>Tus datos guardados de envío y contacto se han completado automáticamente.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('profile');
                  setIsAuthModalOpen(true);
                }}
                className="text-zinc-950 font-bold hover:underline bg-transparent border-0 cursor-pointer text-xs"
              >
                Mi Cuenta &rarr;
              </button>
            </div>
          )}

          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Datos de Contacto
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={errors.nombre}
              placeholder="Ej: María"
              maxLength={50}
              required
            />
            <Input
              label="Apellido *"
              value={formData.apellido}
              onChange={(e) => handleInputChange('apellido', e.target.value)}
              error={errors.apellido}
              placeholder="Ej: Gómez"
              maxLength={50}
              required
            />
          </div>
          
          <div className="mt-4">
            <Input
              label="Número de Teléfono *"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              error={errors.telefono}
              placeholder="Ej: 5491123456789"
              maxLength={30}
              required
            />
          </div>

          <Input
            label="Email (Opcional)"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="maria@ejemplo.com"
            maxLength={100}
          />

          <h3 className="text-lg font-bold text-gray-900 pt-4 mb-4 pb-2 border-b border-gray-100">
            Métodos de Envío y Pago
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Methods */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Método de Envío
              </label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-colors ${formData.metodoEnvio === 'retiro' ? 'border-zinc-800 bg-zinc-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="metodoEnvio"
                    checked={formData.metodoEnvio === 'retiro'}
                    onChange={() => handleInputChange('metodoEnvio', 'retiro')}
                    className="w-4 h-4 text-zinc-950 focus:ring-zinc-800"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Retiro en Local</span>
                    <span className="text-xs text-gray-400">Sin costo adicional - Av. Corrientes 1234</span>
                  </div>
                </label>
                
                <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-colors ${formData.metodoEnvio === 'envio' ? 'border-zinc-800 bg-zinc-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="metodoEnvio"
                    checked={formData.metodoEnvio === 'envio'}
                    onChange={() => handleInputChange('metodoEnvio', 'envio')}
                    className="w-4 h-4 text-zinc-950 focus:ring-zinc-800"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Envío a Domicilio</span>
                    <span className="text-xs text-gray-400">Coordinado con el vendedor</span>
                  </div>
                </label>
              </div>
            </div>
 
            {/* Payment Methods */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Método de Pago
              </label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-colors ${formData.metodoPago === 'efectivo' ? 'border-zinc-800 bg-zinc-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    checked={formData.metodoPago === 'efectivo'}
                    onChange={() => handleInputChange('metodoPago', 'efectivo')}
                    className="w-4 h-4 text-zinc-950 focus:ring-zinc-800"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Efectivo</span>
                    <span className="text-xs text-gray-400">Al retirar o recibir el producto</span>
                  </div>
                </label>
                
                <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-colors ${formData.metodoPago === 'transferencia' ? 'border-zinc-800 bg-zinc-50/10' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    checked={formData.metodoPago === 'transferencia'}
                    onChange={() => handleInputChange('metodoPago', 'transferencia')}
                    className="w-4 h-4 text-zinc-950 focus:ring-zinc-800"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Transferencia Bancaria</span>
                    <span className="text-xs text-gray-400">CBU / Alias provisto por el vendedor</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Delivery Address (conditionally shown) */}
          {formData.metodoEnvio === 'envio' && (
            <div className="pt-2 animate-fade-in">
              <Input
                label="Dirección Completa de Envío"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                error={errors.direccion}
                placeholder="Calle, Número, Departamento, Ciudad"
                maxLength={150}
                required
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              * La confirmación de stock y entrega final se realiza mediante chat.
            </span>
          </div>
        </form>

        {/* Order Summary Column */}
        <div className="space-y-6">
          <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Resumen del Pedido
            </h3>
            
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex justify-between gap-3 text-sm">
                  <div>
                    <span className="font-bold text-gray-900">{item.cantidad}x</span> {item.nombre}
                  </div>
                  <span className="font-semibold text-gray-700 flex-shrink-0">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Box */}
            <div className="py-4 border-t border-gray-200 space-y-2 text-left">
              <label className="text-xs font-bold text-gray-700 block">¿Tienes un cupón de descuento?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="CÓDIGO"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-1 focus:ring-zinc-800"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                >
                  Aplicar
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-600 font-bold">{couponError}</p>}
              {appliedCoupon && (
                <div className="bg-purple-50 border border-purple-100 p-2.5 rounded-xl flex items-center justify-between text-[10px] font-bold text-purple-800">
                  <span>✓ Cupón {appliedCoupon.codigo} aplicado</span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-500 hover:text-red-750 hover:underline border-0 bg-transparent font-bold cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-purple-650 font-bold">
                  <span>Descuento ({appliedCoupon.codigo})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span className="text-zinc-950 font-bold">A coordinar</span>
              </div>
              <div className="flex justify-between items-center text-gray-900 pt-2 font-bold border-t border-dashed border-gray-200">
                <span className="text-base">Total</span>
                <span className="text-2xl font-extrabold text-zinc-950 tracking-tight">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                type="button" 
                onClick={handleSubmit} 
                disabled={checkoutLoading} 
                className="w-full justify-center gap-2"
              >
                {checkoutLoading ? (
                  <span className="animate-pulse">Procesando pedido...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.988 4.493-9.988 10 0 1.758.455 3.414 1.259 4.867l-1.283 4.697 4.81-1.26c1.393.754 2.977 1.189 4.671 1.189 5.506 0 10.02-4.494 10.02-10 0-5.507-4.514-10-10.02-10zm0 1.562c4.656 0 8.447 3.791 8.447 8.438 0 4.647-3.79 8.438-8.447 8.438-1.579 0-3.041-.439-4.296-1.2l-.307-.183-2.836.743.758-2.775-.2-.319a8.337 8.337 0 0 1-1.319-4.704c0-4.647 3.791-8.438 8.447-8.438zm-3.774 4.394c-.21 0-.422.046-.612.164-.268.163-.564.493-.564 1.127 0 .848.43 1.696.643 1.992.214.296 2.062 3.149 5.012 4.307.701.276 1.25.441 1.677.575.706.223 1.349.191 1.859.117.568-.083 1.748-.713 1.996-1.401.248-.688.248-1.277.174-1.401-.074-.124-.272-.197-.568-.346-.298-.148-1.748-.862-2.02-.961-.272-.099-.47-.148-.668.148-.198.297-.767.962-.94 1.16-.174.197-.347.222-.643.074-.298-.148-1.255-.462-2.39-1.472-.882-.787-1.478-1.759-1.65-2.055-.174-.297-.019-.457.13-.605.133-.133.297-.346.446-.519.148-.173.197-.296.297-.494.099-.197.049-.37-.025-.519-.074-.148-.668-1.605-.915-2.2-.241-.58-.521-.502-.714-.512z"/>
                    </svg>
                    Finalizar Pedido por WhatsApp
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
