import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, LogOut, ShoppingBag,
  CheckCircle2, AlertCircle, ArrowRight, Lock
} from 'lucide-react';

export default function MyAccount() {
  const {
    user,
    loginClient,
    registerClient,
    loginWithGoogle,
    updateClientProfile,
    logoutAdmin,
    setView,
    setAuthModalTab,
  } = useCart();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
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

  // Sync form with user data when logged in
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
      setFormData({ nombre: '', email: '', password: '', telefono: '', direccion: '' });
    }
    setErrors({});
  }, [user]);

  const validate = () => {
    const e = {};
    if (tab === 'register') {
      if (!formData.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
      if (!formData.email.trim()) e.email = 'El correo es obligatorio.';
      if (!formData.password || formData.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    } else if (tab === 'login') {
      if (!formData.email.trim()) e.email = 'El correo es obligatorio.';
      if (!formData.password.trim()) e.password = 'La contraseña es obligatoria.';
    } else if (tab === 'profile') {
      if (!formData.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (user) {
      // Profile update
      const res = await updateClientProfile({
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion
      });
      if (res.success) setSuccessMsg('¡Perfil actualizado correctamente!');
      else setErrorMsg(res.error || 'Error al actualizar el perfil.');
    } else if (tab === 'login') {
      const res = await loginClient(formData.email, formData.password);
      if (res.success) setSuccessMsg('¡Sesión iniciada con éxito!');
      else setErrorMsg(res.error || 'Credenciales incorrectas.');
    } else {
      const res = await registerClient(formData.email, formData.password, {
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion
      });
      if (res.success) setSuccessMsg('¡Cuenta creada e iniciada con éxito!');
      else setErrorMsg(res.error || 'Error al crear la cuenta.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle();
    if (!res.success) {
      setErrorMsg(res.error || 'Error al iniciar sesión con Google.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header strip ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-taupe" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-taupe">Mi Cuenta</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-jakarta font-medium text-charcoal tracking-tighter leading-tight">
              {user ? `Hola, ${formData.nombre || user.email.split('@')[0]}.` : 'Bienvenida.'}
            </h1>
            <p className="mt-3 text-sm text-gray-400 font-sans max-w-md leading-relaxed">
              {user
                ? 'Gestioná tus datos de entrega y accedé a tu historial de pedidos.'
                : 'Iniciá sesión o creá tu cuenta para agilizar tus próximas compras.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ─── Left panel ─── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {user ? (
              <>
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center shrink-0">
                    <span className="text-alabaster text-xl font-jakarta font-medium">
                      {(formData.nombre || user.email)?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-charcoal font-jakarta">{formData.nombre || 'Sin nombre'}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => { setView('myorders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group flex items-center justify-between px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-charcoal hover:bg-gray-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-charcoal transition-colors" />
                      <span className="text-sm font-semibold text-charcoal">Mis Pedidos</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-charcoal group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-red-500 transition-colors">Cerrar Sesión</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:block">
                <h2 className="text-2xl font-jakarta font-medium text-charcoal tracking-tight mb-3">
                  Tu espacio personal.
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Con tu cuenta podés guardar tu dirección de envío, revisar tus pedidos anteriores y agilizar tus próximas compras.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  {[
                    { icon: MapPin, label: 'Dirección de envío guardada' },
                    { icon: ShoppingBag, label: 'Historial de pedidos' },
                    { icon: User, label: 'Datos de contacto pre-cargados' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-taupe" />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right panel (form) ─── */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">

              {/* Alerts */}
              {successMsg && (
                <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-2xl text-xs font-semibold text-green-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs font-semibold text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* ── LOGGED IN ── */}
              {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-charcoal mb-6 font-jakarta">Mis datos de entrega</h3>

                  <Input
                    label="Nombre Completo"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    error={errors.nombre}
                    placeholder="María Gómez"
                    required
                  />
                  <Input
                    label="Correo Electrónico"
                    value={formData.email}
                    disabled
                    className="opacity-60"
                  />
                  <Input
                    label="Teléfono / WhatsApp"
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    placeholder="+5493804918672"
                  />
                  <Input
                    label="Dirección de Envío"
                    value={formData.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    placeholder="Calle, Número, Depto, Ciudad"
                  />

                  <div className="pt-4">
                    <Button type="submit" loading={loading} className="w-full py-3.5 text-xs font-bold uppercase tracking-wider">
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              ) : (
                /* ── LOGGED OUT ── */
                <div className="space-y-6">
                  {/* Tabs */}
                  <div className="flex gap-1 p-1 bg-gray-50 rounded-full border border-gray-100">
                    {[
                      { key: 'login', label: 'Iniciar Sesión' },
                      { key: 'register', label: 'Crear Cuenta' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => { setTab(key); setErrors({}); setErrorMsg(''); }}
                        className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          tab === key
                            ? 'bg-charcoal text-alabaster shadow-sm'
                            : 'text-gray-500 hover:text-charcoal'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-full hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.56 8.89 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.18-2 3.71-4.96 3.71-8.7z" />
                      <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.97 0 13.2s.54 4.38 1.5 6.3l3.86-3z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.72-2.88c-1.1.74-2.52 1.18-4.24 1.18-3.11 0-5.73-2.52-6.64-5.46L1.5 15.9C3.39 19.75 7.35 22.4 12 23z" />
                    </svg>
                    Continuar con Google
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">o con tu correo</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Email / password form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {tab === 'register' && (
                      <Input
                        label="Nombre Completo"
                        value={formData.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        error={errors.nombre}
                        placeholder="María Gómez"
                        required
                      />
                    )}
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="maria@ejemplo.com"
                      required
                    />
                    <Input
                      label="Contraseña"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      error={errors.password}
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    {tab === 'register' && (
                      <>
                        <Input
                          label="Teléfono / WhatsApp (Opcional)"
                          value={formData.telefono}
                          onChange={(e) => handleChange('telefono', e.target.value)}
                          placeholder="+5493804918672"
                        />
                        <Input
                          label="Dirección de Envío (Opcional)"
                          value={formData.direccion}
                          onChange={(e) => handleChange('direccion', e.target.value)}
                          placeholder="Calle, Número, Depto, Ciudad"
                        />
                      </>
                    )}
                    <div className="pt-2">
                      <Button type="submit" loading={loading} className="w-full py-3.5 text-xs font-bold uppercase tracking-wider">
                        {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
