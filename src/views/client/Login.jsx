import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Lock, Mail, ChevronLeft, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { loginAdmin, setView } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    const res = await loginAdmin(email, password);
    
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-gray-50/50">
      
      {/* Back button */}
      <button
        onClick={() => setView('home')}
        className="mb-8 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors focus:outline-none"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a la tienda
      </button>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-xl max-w-md w-full relative overflow-hidden">
        {/* Top brand header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-100">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Acceso Admin</h2>
          <p className="text-xs text-gray-400 mt-1">
            Solo para usuarios administradores de la plataforma.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-xs text-red-600 animate-fade-in">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
            <div>
              <span className="font-bold block">Error de Acceso</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@katherine.com"
              required
              className="pl-2"
            />
          </div>

          <div>
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="pl-2"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3.5 text-xs font-bold"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
