import React from 'react';

export default function Badge({
  children,
  variant = 'success',
  className = '',
  ...props
}) {
  const hasRounded = className.includes('rounded-');
  const baseStyles = `inline-flex items-center px-2.5 py-0.5 ${hasRounded ? '' : 'rounded-full'} text-xs font-bold transition-all`;
  
  const variants = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
