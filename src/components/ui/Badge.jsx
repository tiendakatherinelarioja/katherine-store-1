import React from 'react';

export default function Badge({
  children,
  variant = 'success',
  className = '',
  ...props
}) {
  const hasRounded = className.includes('rounded-');
  const baseStyles = `inline-flex items-center px-2.5 py-0.5 ${hasRounded ? '' : 'rounded-full'} text-[10px] uppercase tracking-wider font-extrabold transition-all`;
  
  const variants = {
    success: 'bg-emerald-50/80 text-emerald-750 border border-emerald-200/50 shadow-xxs',
    danger: 'bg-rose-50/80 text-rose-750 border border-rose-200/50 shadow-xxs',
    info: 'bg-sky-50/80 text-sky-750 border border-sky-200/50 shadow-xxs',
    warning: 'bg-amber-50/80 text-amber-800 border border-amber-200/50 shadow-xxs',
    neutral: 'bg-zinc-50/80 text-zinc-700 border border-zinc-200/50 shadow-xxs',
  };

  const badgeDots = {
    success: 'bg-emerald-500 shadow-xs shadow-emerald-500/30',
    danger: 'bg-rose-500 shadow-xs shadow-rose-500/30 animate-pulse',
    info: 'bg-sky-500 shadow-xs shadow-sky-500/30',
    warning: 'bg-amber-500 shadow-xs shadow-amber-500/30 animate-pulse',
    neutral: 'bg-zinc-400',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badgeDots[variant]} mr-1.5 shrink-0`} />
      {children}
    </span>
  );
}
