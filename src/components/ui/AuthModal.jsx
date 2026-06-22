import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { User, Mail, Lock, Phone, MapPin, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    user,
    loginClient,
    registerClient,
    loginWithGoogle,
    updateClientProfile,
    logoutAdmin,
    setView
  } = useCart();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize form with user metadata if logged in
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.user_metadata?.nombre || user.user_metadata?.full_name || '',
        email: user.email || '',
        password: '',
        telefono: user.user_metadata?.telefono || '',
        direccion: user.user_metadata?.direccion || ''
      });
      setErrorMsg('');
      setSuccessMsg('');
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        direccion: ''
      });
    }
    setErrors({});
  }, [user, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (authModalTab === 'register') {
      if (!formData.nombre.trim()) tempErrors.nombre = 'El nombre es obligatorio.';
      if (!formData.email.trim()) tempErrors.email = 'El correo electrónico es obligatorio.';
      if (!formData.password.trim() || formData.password.length < 6) {
        tempErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
      }
    } else if (authModalTab === 'login') {
      if (!formData.email.trim()) tempErrors.email = 'El correo electrónico es obligatorio.';
      if (!formData.password.trim()) tempErrors.password = 'La contraseña es obligatoria.';
    } else if (authModalTab === 'profile') {
      if (!formData.nombre.trim()) tempErrors.nombre = 'El nombre es obligatorio.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (authModalTab === 'login') {
      const res = await loginClient(formData.email, formData.password);
      if (res.success) {
        setSuccessMsg('¡Sesión iniciada con éxito!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Credenciales incorrectas.');
      }
    } else if (authModalTab === 'register') {
      const res = await registerClient(formData.email, formData.password, {
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion
      });
      if (res.success) {
        setSuccessMsg('¡Usuario registrado con éxito! Sesión iniciada.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 2000);
      } else {
        setErrorMsg(res.error || 'Error al registrar el usuario.');
      }
    }
    setLoading(false);
  };

  const handleGoogleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle();
    if (!res.success) {
      setErrorMsg(res.error || 'Error al iniciar sesión con Google.');
      setLoading(false);
    }
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateClientProfile({
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion
    });

    if (res.success) {
      setSuccessMsg('¡Perfil actualizado correctamente!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.error || 'Error al actualizar el perfil.');
    }
    setLoading(false);
  };

  const handleViewOrders = () => {
    setIsAuthModalOpen(false);
    setView('myorders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    if (user) return 'Mi Cuenta';
    return authModalTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta';
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={getTitle()}
      className="max-w-md"
    >
      <div className="font-sans text-gray-800 py-2">
        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 pl-3 py-1.5 border-l-2 border-zinc-950 text-xs text-zinc-900 animate-fade-in text-left">
            {successMsg}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 pl-3 py-1.5 border-l-2 border-red-600 text-xs text-red-650 animate-fade-in text-left">
            {errorMsg}
          </div>
        )}

        {/* -------------------- LOGGED IN VIEW -------------------- */}
        {user ? (
          <form onSubmit={handleProfileUpdateSubmit} className="space-y-4">
            <p className="text-gray-500 text-xs leading-relaxed mb-2 text-left">
              Hola, <strong className="text-gray-900">{formData.nombre || user.email}</strong>. Desde aquí puedes gestionar tu información de entrega para tus compras.
            </p>

            <Input
              label="Nombre Completo"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={errors.nombre}
              placeholder="María Gómez"
              required
            />

            <Input
              label="Correo Electrónico (No modificable)"
              value={formData.email}
              disabled
              className="opacity-70"
            />

            <Input
              label="Número de Teléfono (WhatsApp)"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="Ej: +5493804918672"
            />

            <Input
              label="Dirección de Envío Frecuente"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Calle, Número, Depto, Ciudad"
            />

            <div className="pt-2 flex flex-col gap-2">
              <Button type="submit" loading={loading} className="w-full py-3.5 text-xs font-bold uppercase tracking-wider">
                Guardar Cambios
              </Button>

              <button
                type="button"
                onClick={handleViewOrders}
                className="w-full py-3 border border-gray-200 hover:border-zinc-800 text-gray-700 hover:text-black rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xxs bg-white"
              >
                Ver Mis Pedidos
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logoutAdmin();
                  setIsAuthModalOpen(false);
                }}
                className="mt-2 text-red-500 hover:text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 py-2 cursor-pointer bg-transparent border-0"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </form>
        ) : (
          /* -------------------- LOGGED OUT VIEW -------------------- */
          <div className="space-y-5">
            {/* Google Authentication (Provider enabled by user in Supabase) */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-full hover:bg-gray-50/50 transition-all duration-200 text-sm font-semibold text-gray-700 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.56 8.89 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.18-2 3.71-4.96 3.71-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.97 0 13.2s.54 4.38 1.5 6.3l3.86-3z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.72-2.88c-1.1.74-2.52 1.18-4.24 1.18-3.11 0-5.73-2.52-6.64-5.46L1.5 15.9C3.39 19.75 7.35 22.4 12 23z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-150"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">o usa tu correo</span>
              <div className="flex-1 h-px bg-gray-150"></div>
            </div>

            {/* Form for email/password */}
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 text-left">
              {authModalTab === 'register' && (
                <Input
                  label="Nombre Completo"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  error={errors.nombre}
                  placeholder="Ej: María Gómez"
                  required
                />
              )}

              <Input
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="maria@ejemplo.com"
                required
              />

              <Input
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                placeholder="Mínimo 6 caracteres"
                required
              />

              {authModalTab === 'register' && (
                <>
                  <Input
                    label="Teléfono / WhatsApp (Opcional)"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="Ej: +5493804918672"
                  />

                  <Input
                    label="Dirección de Envío (Opcional)"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Calle, Número, Depto, Ciudad"
                  />
                </>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-3.5 text-xs font-bold uppercase tracking-wider"
                >
                  {authModalTab === 'login' ? 'Iniciar Sesión' : 'Registrar Cuenta'}
                </Button>
              </div>
            </form>

            {/* Toggle Tab Footer */}
            <div className="text-center pt-2">
              {authModalTab === 'login' ? (
                <p className="text-xs text-gray-500">
                  ¿No tenés una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('register')}
                    className="text-zinc-950 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Registrate!
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  ¿Ya tenés una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('login')}
                    className="text-zinc-950 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Iniciá sesión
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
