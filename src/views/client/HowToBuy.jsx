import React from 'react';
import { useCart } from '../../context/CartContext';
import { Compass, ShoppingBag, FileText, MessageCircle, ArrowRight } from 'lucide-react';

export default function HowToBuy() {
  const { setView } = useCart();

  const steps = [
    {
      icon: <Compass className="w-5 h-5 text-rose-500" />,
      borderColor: 'border-rose-450 bg-rose-50/60',
      step: 'Paso 1',
      title: 'Explora el Catálogo',
      desc: 'Navega por nuestra selección exclusiva de productos. Puedes usar el buscador integrado o los filtros para separar rápidamente por Maquillaje, Manicura, Accesorios o Termos.',
      side: 'left'
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
      borderColor: 'border-blue-450 bg-blue-50/60',
      step: 'Paso 2',
      title: 'Arma tu Carrito',
      desc: 'Selecciona las cantidades que necesites y añade los productos al carrito de compras. Tu cajón de compras permanecerá activo y podrás modificarlo en cualquier momento.',
      side: 'right'
    },
    {
      icon: <FileText className="w-5 h-5 text-amber-500" />,
      borderColor: 'border-amber-450 bg-amber-50/60',
      step: 'Paso 3',
      title: 'Completá tus Datos',
      desc: 'Presiona "Iniciar Pedido" e ingresa tu información básica de contacto y el tipo de entrega (retiro en local o envío a domicilio). Esto nos ayudará a preparar tu paquete.',
      side: 'left'
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-emerald-500" />,
      borderColor: 'border-emerald-450 bg-emerald-50/60',
      step: 'Paso 4',
      title: 'Concretá por WhatsApp',
      desc: 'Al confirmar, se abrirá de forma automática un chat de WhatsApp con el detalle estructurado de tu pedido. Nosotros validaremos el pago (Efectivo/Transferencia) y coordinaremos la entrega al instante.',
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
          Diseñamos una experiencia de compra fluida y segura. Sin registros obligatorios, sin intermediarios automatizados. Todo de forma personalizada vía WhatsApp.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative mb-8">
        
        {/* Central Vertical Line (Desktop: Centered, Mobile: Left aligned) */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-zinc-250 -translate-x-1/2"></div>
        
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
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.step}</span>
                      <h3 className="font-bold text-gray-950 text-base mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
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
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.step}</span>
                    <h3 className="font-bold text-gray-950 text-base mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
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
