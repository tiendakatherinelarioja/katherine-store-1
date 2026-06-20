import React from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Search, 
  ShoppingCart, 
  ShoppingBag, 
  User, 
  MapPin, 
  Truck, 
  Coins, 
  ArrowRight, 
  ClipboardList, 
  Mail, 
  AlertTriangle 
} from 'lucide-react';

export default function HowToBuy() {
  const { setView } = useCart();

  const steps = [
    {
      icon: <Search className="w-5 h-5 text-purple-500" />,
      borderColor: 'border-purple-200 bg-purple-50/60',
      step: 'Paso 1',
      title: 'Elige tu producto',
      desc: 'Navega por nuestra tienda y selecciona el producto que deseas adquirir.',
      side: 'left'
    },
    {
      icon: <ShoppingCart className="w-5 h-5 text-indigo-500" />,
      borderColor: 'border-indigo-200 bg-indigo-50/60',
      step: 'Paso 2',
      title: 'Agregar al carrito',
      desc: 'Haz clic en el botón de "Agregar al carrito". Esto guardará el producto y te llevará directamente a visualizar tu carrito de compras.',
      side: 'right'
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
      borderColor: 'border-blue-200 bg-blue-50/60',
      step: 'Paso 3',
      title: 'Define tu compra',
      desc: 'Puedes cerrar el carrito y seguir agregando otros productos de la tienda, o avanzar haciendo clic en el botón de "Iniciar Compra".',
      side: 'left'
    },
    {
      icon: <User className="w-5 h-5 text-teal-500" />,
      borderColor: 'border-teal-200 bg-teal-50/60',
      step: 'Paso 4',
      title: 'Completa tus datos',
      desc: 'Ingresa tu información básica de contacto para que podamos identificar tu pedido y haz clic en "Continuar".',
      side: 'right'
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-500" />,
      borderColor: 'border-emerald-200 bg-emerald-50/60',
      step: 'Paso 5',
      title: 'Dirección de envío',
      desc: 'Ingresa la dirección exacta en donde deseas recibir tu pedido. Luego, haz clic en "Continuar".',
      side: 'left'
    },
    {
      icon: <Truck className="w-5 h-5 text-amber-500" />,
      borderColor: 'border-amber-200 bg-amber-50/60',
      step: 'Paso 6',
      title: 'Método de envío',
      desc: 'Selecciona la opción de envío de tu preferencia para recibir los productos y haz clic en "Continuar".',
      side: 'right'
    },
    {
      icon: <Coins className="w-5 h-5 text-yellow-600" />,
      borderColor: 'border-yellow-200 bg-yellow-50/60',
      step: 'Paso 7',
      title: 'Medio de pago',
      desc: (
        <div className="space-y-2 mt-1">
          <p className="text-gray-500 text-xs">Selecciona la forma de pago que desees:</p>
          <div className="flex flex-col gap-1.5 pl-2 text-xs text-gray-600 font-semibold">
            <span className="flex items-center gap-1.5">💵 Abonar en el local en efectivo.</span>
            <span className="flex items-center gap-1.5">🏦 Transferencia, envío de dinero por Mercado Pago o depósito bancario.</span>
          </div>
          <div className="mt-3 text-[10.5px] font-black text-red-600 bg-red-50/80 border border-red-100 rounded-xl p-2.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 animate-pulse" />
            <span>NO SE ACEPTAN PAGOS CON TARJETAS DE CRÉDITO.</span>
          </div>
        </div>
      ),
      side: 'left'
    },
    {
      icon: <ArrowRight className="w-5 h-5 text-orange-500" />,
      borderColor: 'border-orange-200 bg-orange-50/60',
      step: 'Paso 8',
      title: 'Confirma el pago',
      desc: 'Una vez que hayas elegido la forma de pago deseada, haz clic en "Continuar".',
      side: 'right'
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-rose-500" />,
      borderColor: 'border-rose-200 bg-rose-50/60',
      step: 'Paso 9',
      title: 'Confirmación de compra',
      desc: 'Llegarás a la pantalla de Confirmación de compra, donde podrás revisar detenidamente toda la información del pedido. Tras validarla, haz clic en "Continuar".',
      side: 'left'
    },
    {
      icon: <Mail className="w-5 h-5 text-gray-500" />,
      borderColor: 'border-gray-200 bg-gray-50/60',
      step: 'Paso 10',
      title: 'Redirección y comprobante',
      desc: 'Serás redirigido a otra pantalla para completar los datos específicos sobre la forma de pago elegida. Después de confirmar la compra, recibirás un correo electrónico de nuestra parte (Ten en cuenta que este correo NO funciona como comprobante de pago).',
      side: 'right'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 pb-12 font-sans text-gray-800">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Guía de Compra
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight tracking-tight">
          ¿Cómo comprar en Katherine?
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Sigue esta sencilla guía paso a paso para completar tu compra de forma exitosa en nuestra tienda en línea.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative mb-8">
        
        {/* Central Vertical Line (Desktop: Centered, Mobile: Left aligned) */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 -translate-x-1/2"></div>
        
        <div className="space-y-12 md:space-y-4">
          {steps.map((item, index) => {
            const isLeft = item.side === 'left';
            return (
              <div 
                key={index}
                className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between w-full min-h-[120px]"
              >
                {/* Left Side Content Box (Desktop Only) */}
                <div className="hidden md:flex md:w-[45%] justify-end text-right">
                  {isLeft && (
                    <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-xxs hover:shadow-md hover:-translate-y-0.5 transition-all duration-350 text-left">
                      <span className="text-[10px] font-bold text-gray-450 uppercase tracking-widest block mb-1">{item.step}</span>
                      <h3 className="font-extrabold text-gray-900 text-base mb-2">{item.title}</h3>
                      <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                    </div>
                  )}
                </div>

                {/* Central Circle Marker */}
                <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 ${item.borderColor} flex items-center justify-center z-10 shadow-xxs`}>
                  {item.icon}
                </div>

                {/* Right Side Content Box (Desktop: Renders if isRight, Mobile: Always renders and aligns to the right) */}
                <div className={`w-full md:w-[45%] pl-14 md:pl-0 flex justify-start text-left ${isLeft ? 'block md:hidden' : 'block'}`}>
                  <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-xxs hover:shadow-md hover:-translate-y-0.5 transition-all duration-350 w-full">
                    <span className="text-[10px] font-bold text-gray-450 uppercase tracking-widest block mb-1">{item.step}</span>
                    <h3 className="font-extrabold text-gray-900 text-base mb-2">{item.title}</h3>
                    <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
