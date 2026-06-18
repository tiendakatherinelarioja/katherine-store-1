import React from 'react';

export default function Input({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  const hasRounded = className.includes('rounded-');
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-4 py-3 ${hasRounded ? '' : 'rounded-2xl'} border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-zinc-800'
        } focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm bg-white placeholder-gray-400`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
