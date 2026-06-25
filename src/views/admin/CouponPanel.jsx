import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Tag, Plus, Trash2, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCoupons } from '../../hooks/useCoupons';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function CouponPanel() {
  const { coupons, loading, addCoupon, deleteCoupon } = useCoupons();
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('porcentaje'); // 'porcentaje' | 'fijo'
  const [newValue, setNewValue] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAdd = async (e) => {
    e.preventDefault();
    const code = newCode.trim().toUpperCase();
    const val = parseFloat(newValue);

    if (!code || isNaN(val) || val <= 0) {
      alert('Por favor completa todos los campos con valores válidos.');
      return;
    }

    if (newType === 'porcentaje' && val > 100) {
      alert('El valor del porcentaje no puede exceder el 100%.');
      return;
    }

    const res = await addCoupon({ codigo: code, tipo: newType, valor: val });
    if (res.success) {
      setNewCode('');
      setNewValue('');
      setCurrentPage(1);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteCoupon(id);
    if (res.success) {
      setDeletingId(null);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = coupons.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs h-full flex flex-col overflow-hidden text-left">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-gray-700" />
          Gestión de Cupones y Promociones
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Crea cupones de descuento fijo o porcentual para que los clientes apliquen en el checkout.
        </p>
      </div>

      {/* Form: Add Coupon */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-150 items-end">
        <div>
          <Input
            label="Código de Cupón *"
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Ej: KATHERINE15"
            className="w-full text-xs bg-white uppercase font-bold"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-800 mb-1.5 block">Tipo de Descuento *</label>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/20 focus:border-zinc-800 transition-all cursor-pointer text-gray-800 font-semibold"
          >
            <option value="porcentaje">Porcentual (%)</option>
            <option value="fijo">Monto Fijo ($)</option>
          </select>
        </div>

        <div>
          <Input
            label="Valor del Descuento *"
            type="number"
            step="0.01"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={newType === 'porcentaje' ? 'Ej: 15' : 'Ej: 1500'}
            className="w-full text-xs bg-white"
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          className="gap-1.5 text-xs py-3 px-4 rounded-2xl justify-center w-full"
          disabled={loading || !newCode.trim() || !newValue}
        >
          <Plus className="w-4 h-4" />
          Crear Cupón
        </Button>
      </form>

      {/* Coupons Table List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading && coupons.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-xs text-gray-400 font-bold animate-pulse">Cargando cupones...</span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
            No hay cupones registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold text-xxs uppercase tracking-widest bg-gray-50/80">
                  <th className="p-3.5 pl-4 rounded-l-md">Código</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Valor</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 rounded-r-md text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-3.5 pl-4 font-bold text-gray-900 tracking-wider">
                      {coupon.codigo}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="neutral">
                        {coupon.tipo === 'porcentaje' ? 'Porcentual' : 'Fijo'}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-bold text-gray-800">
                      {coupon.tipo === 'porcentaje' ? `${coupon.valor}%` : `$${parseFloat(coupon.valor).toFixed(2)}`}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={coupon.activo ? 'success' : 'danger'}>
                        {coupon.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => setDeletingId(coupon.id)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-md transition-colors cursor-pointer"
                        title="Eliminar Cupón"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 shrink-0">
          <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">
            Página {currentPage} de {totalPages} ({coupons.length} cupones)
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                currentPage === 1
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-gray-650 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                currentPage === totalPages
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-gray-650 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => handleDelete(deletingId)}
        title="¿Eliminar Cupón?"
        description="¿Estás seguro de que deseas eliminar este cupón? Los clientes ya no podrán usarlo en la tienda."
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

    </div>
  );
}
