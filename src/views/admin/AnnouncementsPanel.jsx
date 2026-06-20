import React, { useState } from 'react';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Trash2, Plus, RefreshCw, Megaphone, CheckCircle, ToggleLeft, ToggleRight, AlertTriangle, Copy, Check } from 'lucide-react';

export default function AnnouncementsPanel() {
  const {
    announcements,
    loading,
    error,
    usingFallback,
    refreshAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  } = useAnnouncements();

  const [newText, setNewText] = useState('');
  const [newLink, setNewLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const res = await addAnnouncement(newText, newLink);
    if (res?.success) {
      setNewText('');
      setNewLink('');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    await updateAnnouncement(id, { activo: !currentStatus });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      await deleteAnnouncement(id);
    }
  };

  const sqlCode = `CREATE TABLE IF NOT EXISTS public.anuncios (
  id SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-green-600" />
            Anuncios y Avisos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Administra los banners publicitarios que se muestran en el carrusel de anuncios de la página de inicio.
          </p>
        </div>
        <button
          onClick={refreshAnnouncements}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          title="Recargar anuncios"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Panel grid layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden min-h-0">
        
        {/* Left Side: Create / Fallback info */}
        <div className="space-y-6 overflow-y-auto pr-2">
          
          {/* Database Missing Warning */}
          {usingFallback && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Modo Local Activo (Local Storage)</span>
              </div>
              <p className="text-amber-700 leading-relaxed">
                La tabla de base de datos `anuncios` no está creada en Supabase. Los anuncios se guardan de forma local en tu navegador.
              </p>
              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 block">Ejecuta este SQL en Supabase para sincronizar:</span>
                <div className="relative bg-gray-900 text-gray-300 font-mono text-[9px] p-2.5 rounded-lg overflow-x-auto pr-10">
                  <pre>{sqlCode}</pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                    title="Copiar código SQL"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form to create */}
          <div className="bg-gray-50/50 border border-gray-150 p-5 rounded-2xl">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-4">
              Nuevo Anuncio
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-800">Texto del Anuncio *</label>
                <textarea
                  required
                  rows="3"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all text-xs bg-white text-gray-800 font-medium placeholder-gray-400 resize-none"
                  placeholder="Ej: ✨ ¡15% OFF abonando con Transferencia bancaria! ✨"
                />
              </div>

              <Input
                label="Enlace del Anuncio (Opcional)"
                className="rounded-md text-xs font-semibold"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Ej: #promociones o url"
              />

              <Button type="submit" className="w-full text-xs py-2.5 rounded-md flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Anuncio
              </Button>
            </form>
          </div>

        </div>

        {/* Right Side: List and state management */}
        <div className="lg:col-span-2 flex flex-col lg:overflow-hidden min-h-[300px] lg:min-h-0">
          
          <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-4 shrink-0">
            Listado de Anuncios ({announcements.length})
          </h3>

          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100 pr-1">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-xs font-bold text-gray-400 animate-pulse">Cargando anuncios...</span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <Megaphone className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-bold">No hay anuncios configurados</p>
                <p className="text-[10px] text-gray-400 mt-1">Crea un anuncio en la sección izquierda para empezar.</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="py-4 flex items-center justify-between gap-4 group">
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold text-gray-900 break-words leading-relaxed ${!ann.activo ? 'opacity-40 line-through' : ''}`}>
                      {ann.texto}
                    </p>
                    {ann.link && ann.link !== '#' && (
                      <span className="text-[10px] text-green-600 font-medium truncate block mt-0.5">
                        Link: {ann.link}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    
                    {/* Badge state */}
                    <div className="hidden sm:block">
                      {ann.activo ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="neutral">Inactivo</Badge>
                      )}
                    </div>

                    {/* Active toggle button */}
                    <button
                      onClick={() => handleToggleActive(ann.id, ann.activo)}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        ann.activo 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-150'
                      }`}
                      title={ann.activo ? 'Desactivar anuncio' : 'Activar anuncio'}
                    >
                      {ann.activo ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Eliminar anuncio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
