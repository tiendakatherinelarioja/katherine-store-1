import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('katherine_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Navigation states for client views & admin layout
  const [view, setView] = useState('home'); // 'home' | 'catalog' | 'checkout' | 'login' | 'admin'
  const [adminTab, setAdminTab] = useState('analytics'); // Default view for admin dashboard: 'analytics' (estadísticas)
  const [selectedProduct, setSelectedProduct] = useState(null); // For detail modals
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  // Auth States
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Client Auth Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'profile'

  useEffect(() => {
    localStorage.setItem('katherine_cart', JSON.stringify(cart));
  }, [cart]);

  // Dynamic user role resolving function
  // SECURITY: Only reads from app_metadata (server-controlled, immutable by client).
  // user_metadata is writable by any authenticated user via supabase.auth.updateUser()
  // and must NEVER be used for authorization decisions.
  const resolveUserRole = async (currentUser) => {
    if (!currentUser) return null;
    
    // 1. ONLY check app_metadata — this field can only be modified via service_role (backend)
    //    user_metadata is intentionally excluded: it is writable by the user themselves.
    const role = currentUser.app_metadata?.role ||
                 currentUser.app_metadata?.rol;
               
    if (role) return role.toLowerCase();

    // 2. Fallback: Query 'perfiles' table (protected by RLS — user sees only their own row)
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', currentUser.id)
        .single();
        
      if (!error && data?.rol) {
        return data.rol.toLowerCase();
      }
    } catch {
      // Silent fail — table may not exist yet, not a security concern
    }

    // 3. Fallback: Query 'profiles' table (protected by RLS — user sees only their own row)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
        
      if (!error && data?.role) {
        return data.role.toLowerCase();
      }
    } catch {
      // Silent fail — table may not exist yet, not a security concern
    }

    return 'cliente'; // Default lowest-privilege role
  };

  // Auth session listener
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const role = await resolveUserRole(session.user);
          setUserRole(role);
          
          // If already authenticated as admin, keep in dashboard
          if (role === 'admin' || role === 'superadmin') {
            setView('admin');
          }
        }
      } catch (err) {
        console.error('Error in initial auth check:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const role = await resolveUserRole(session.user);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      setCheckingAuth(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        const role = await resolveUserRole(data.user);
        
        if (role === 'admin' || role === 'superadmin') {
          setUserRole(role);
          setView('admin');
          return { success: true };
        } else {
          // Access denied: Role not allowed
          await supabase.auth.signOut();
          setUser(null);
          setUserRole(null);
          throw new Error('Acceso denegado. Se requieren permisos de administrador.');
        }
      }
      throw new Error('No se pudo autenticar el usuario.');
    } catch (err) {
      console.error('Error in loginAdmin:', err);
      return { success: false, error: err.message };
    } finally {
      setCheckingAuth(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      setView('home');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const loginClient = async (email, password) => {
    try {
      setCheckingAuth(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error in loginClient:', err);
      return { success: false, error: err.message };
    } finally {
      setCheckingAuth(false);
    }
  };

  const registerClient = async (email, password, metadata) => {
    try {
      setCheckingAuth(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: metadata.nombre || '',
            telefono: metadata.telefono || '',
            direccion: metadata.direccion || '',
            rol: 'cliente'
          }
        }
      });
      if (error) throw error;
      return { success: true, user: data?.user };
    } catch (err) {
      console.error('Error in registerClient:', err);
      return { success: false, error: err.message };
    } finally {
      setCheckingAuth(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error in loginWithGoogle:', err);
      return { success: false, error: err.message };
    }
  };

  const updateClientProfile = async (metadata) => {
    try {
      setCheckingAuth(true);
      const { data, error } = await supabase.auth.updateUser({
        data: {
          nombre: metadata.nombre,
          telefono: metadata.telefono,
          direccion: metadata.direccion
        }
      });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch (err) {
      console.error('Error in updateClientProfile:', err);
      return { success: false, error: err.message };
    } finally {
      setCheckingAuth(false);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      }
      
      const newItem = {
        id: product.id,
        nombre: product.name || product.nombre || '',
        precio: parseFloat(product.price || product.precio || 0),
        imagen_url: product.image_url || product.image || '',
        cantidad: quantity
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const cartCount = cart.reduce((count, item) => count + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        view,
        setView,
        adminTab,
        setAdminTab,
        selectedProduct,
        setSelectedProduct,
        categoryFilter,
        setCategoryFilter,
        user,
        userRole,
        checkingAuth,
        loginAdmin,
        logoutAdmin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        loginClient,
        registerClient,
        loginWithGoogle,
        updateClientProfile
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
