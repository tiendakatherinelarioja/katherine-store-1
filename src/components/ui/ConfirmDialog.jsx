import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}) {
  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-8 h-8 text-red-650" />;
      case 'success':
        return <CheckCircle2 className="w-8 h-8 text-green-650" />;
      case 'info':
        return <Info className="w-8 h-8 text-blue-650" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />;
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-600/20';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg hover:shadow-green-600/20';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/20';
      case 'warning':
      default:
        return 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl max-w-sm w-full p-8 z-10 overflow-hidden flex flex-col items-center text-center space-y-5"
          >
            {/* Close Button (only if not loading) */}
            {!loading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-150 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Icon Wrapper */}
            <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-center">
              {getIcon()}
            </div>

            {/* Text details */}
            <div className="space-y-2">
              <h3 className="text-lg font-jakarta font-bold text-zinc-950 tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                {description}
              </p>
            </div>

            {/* Actions Grid */}
            <div className="flex w-full gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 py-3 text-xs rounded-xl font-semibold border-gray-250 hover:bg-gray-50 text-gray-700 transition-all"
                onClick={onClose}
                disabled={loading}
              >
                {cancelText}
              </Button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${getButtonStyles()} ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Cargando...</span>
                  </>
                ) : (
                  <span>{confirmText}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
