import React from 'react';

export default function FloatingWhatsApp() {
  const phoneNumber = '5493804918672';
  const defaultMessage = '¡Hola! Vengo de la tienda Katherine Store y me gustaría hacer una consulta.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center animate-bounce-slow group"
      title="Contactar por WhatsApp"
      id="whatsapp-floating-button"
    >
      {/* Icon */}
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.012 2c-5.506 0-9.988 4.493-9.988 10 0 1.758.455 3.414 1.259 4.867l-1.283 4.697 4.81-1.26c1.393.754 2.977 1.189 4.671 1.189 5.506 0 10.02-4.494 10.02-10 0-5.507-4.514-10-10.02-10zm0 1.562c4.656 0 8.447 3.791 8.447 8.438 0 4.647-3.79 8.438-8.447 8.438-1.579 0-3.041-.439-4.296-1.2l-.307-.183-2.836.743.758-2.775-.2-.319a8.337 8.337 0 0 1-1.319-4.704c0-4.647 3.791-8.438 8.447-8.438zm-3.774 4.394c-.21 0-.422.046-.612.164-.268.163-.564.493-.564 1.127 0 .848.43 1.696.643 1.992.214.296 2.062 3.149 5.012 4.307.701.276 1.25.441 1.677.575.706.223 1.349.191 1.859.117.568-.083 1.748-.713 1.996-1.401.248-.688.248-1.277.174-1.401-.074-.124-.272-.197-.568-.346-.298-.148-1.748-.862-2.02-.961-.272-.099-.47-.148-.668.148-.198.297-.767.962-.94 1.16-.174.197-.347.222-.643.074-.298-.148-1.255-.462-2.39-1.472-.882-.787-1.478-1.759-1.65-2.055-.174-.297-.019-.457.13-.605.133-.133.297-.346.446-.519.148-.173.197-.296.297-.494.099-.197.049-.37-.025-.519-.074-.148-.668-1.605-.915-2.2-.241-.58-.521-.502-.714-.512z"/>
      </svg>
      
      {/* Tooltip on hover */}
      <span className="absolute right-16 bg-zinc-900 text-white text-xxs font-bold py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        ¿En qué podemos ayudarte?
      </span>
    </a>
  );
}
