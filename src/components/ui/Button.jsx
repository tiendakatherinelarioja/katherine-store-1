import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const hasRounded = className.includes('rounded-');
  const baseStyles = `inline-flex items-center justify-center font-semibold ${hasRounded ? '' : 'rounded-full'} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`;

  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-black focus:ring-gray-950 active:scale-[0.98]',
    secondary: 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-200 active:scale-[0.98]',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-[0.98]',
    ghost: 'text-gray-600 hover:text-black hover:bg-gray-100 focus:ring-gray-200 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
