# Resumen del Proyecto: Katherine E-Commerce

Este documento contiene una descripción detallada de la arquitectura, base de datos, flujo de datos y componentes del proyecto **Katherine E-Commerce** (un portal de ventas con panel de administración integrado y checkout a través de WhatsApp). Sirve como referencia para el modelo de IA con el objetivo de agilizar el entendimiento del proyecto y reducir el consumo de tokens.

---

## 🛠️ Stack Tecnológico
- **Frontend**: React 19 (con Javascript / JSX)
- **Compilador / Servidor**: Vite 8
- **Estilos**: Tailwind CSS v4 (tipografía Poppins configurada a nivel global)
- **Base de Datos y Backend**: Supabase (JS SDK `@supabase/supabase-js`)
- **Iconos**: Lucide React (`lucide-react`)

---

## 🗃️ Arquitectura de Archivos y Componentes

```text
katherine-ecommerce/
├── index.html                   # HTML principal, carga la tipografía Poppins y monta el root
├── src/
│   ├── main.jsx                 # Punto de entrada de React
│   ├── App.jsx                  # Enrutamiento de vistas y llamada inicial a hooks de productos
│   ├── App.css / index.css      # Estilos e importaciones de Tailwind v4 y variables de tema
│   ├── context/
│   │   └── CartContext.jsx      # Contexto de estado global: carrito, vistas activas y autenticación admin
│   ├── hooks/
│   │   ├── useProducts.js       # Hook para productos (lectura de vista, CRUD de tabla en Supabase)
│   │   ├── useCategories.js     # Hook para categorías (ABM en Supabase, reasignación automática)
│   │   ├── useOrders.js         # Hook para pedidos (realtime listener, estado y checkout RPC)
│   │   └── useAnnouncements.js  # Hook para anuncios (lectura, CRUD y fallback a LocalStorage)
│   ├── services/
│   │   └── supabaseClient.js    # Inicialización del cliente Supabase
│   ├── utils/
│   │   └── imageProcessor.js    # Utilidad de canvas para compresión de imágenes a WebP
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── Navbar.jsx       # Barra de navegación superior con logo e iconos minimalistas
│   │   │   └── Footer.jsx       # Pie de página y enlaces directos
│   │   ├── cart/
│   │   │   └── CartDrawer.jsx   # Cajón lateral del carrito con lista de ítems agregados
│   │   ├── product/
│   │   │   ├── ProductCard.jsx  # Tarjeta individual del catálogo del cliente
│   │   │   ├── ProductGrid.jsx  # Grilla responsiva de productos
│   │   │   └── ProductFilters.jsx # Filtros jerárquicos y buscador (sin lupa de búsqueda)
│   │   └── ui/
│   │       ├── Button.jsx       # Componente de botón reutilizable con variantes
│   │       ├── Badge.jsx        # Etiqueta de estado (Disponible, Agotado, etc.)
│   │       ├── Input.jsx        # Input estilizado de formulario con foco gris neutro
│   │       └── Modal.jsx        # Modal genérico con fondo desenfocado
│   └── views/
│       ├── client/
│       │   ├── Home.jsx         # Inicio (carrusel completo, anuncios planos, cards con SVGs y destacados)
│       │   ├── Catalog.jsx      # Catálogo interactivo con filtros de 2 niveles (General -> Subcategoría)
│       │   ├── HowToBuy.jsx     # Guía de compra timeline colorida (responsividad por CSS puro)
│       │   ├── Contact.jsx      # Formulario de contacto minimalista en dos columnas asimétricas
│       │   ├── Checkout.jsx     # Formulario de checkout con tarjetas de selección y cierre en WhatsApp
│       │   └── Login.jsx        # Pantalla de login para administradores
│       └── admin/
│           ├── AdminLayout.jsx  # Layout del dashboard con barra lateral y control de pestañas oscuras
│           ├── AnalyticsPanel.jsx # Métricas globales de pedidos e ingresos
│           ├── InventoryPanel.jsx # Inventario con drawer ensanchado y amigable (pasos coloridos)
│           ├── CategoryPanel.jsx  # ABM de categorías
│           ├── AnnouncementsPanel.jsx # Panel ABM para los anuncios activos del carrusel/hero
│           └── OrdersPanel.jsx  # Listado de pedidos recibidos en tiempo real
```

---

## 💾 Modelo de Datos y Base de Datos (Supabase)

El sistema opera directamente sobre Supabase consumiendo las siguientes tablas, vistas y funciones:

### 1. Tabla `productos`
Almacena el catálogo de productos disponibles para la tienda.
- `id` (uuid, PK)
- `nombre` (text)
- `precio` (numeric)
- `stock` (integer)
- `categoria` (text, guardado en minúsculas)
- `descripcion` (text)
- `imagen_url` (text, almacena base64 WebP procesada o enlaces externos)
- `created_at` (timestamp)

### 2. Tabla `categorias`
Gestiona de forma dinámica las categorías configuradas por el administrador.
- `id` (uuid, PK)
- `nombre` (text)

### 3. Tabla `anuncios`
Gestiona las promociones dinámicas exhibidas en la barra superior del Home.
- `id` (serial/integer, PK)
- `texto` (text)
- `link` (text, opcional)
- `activo` (boolean, controla exhibición)
- `created_at` (timestamp)

### 4. Tabla `pedidos` y `detalles_pedido`
Almacena los pedidos de compra realizados por los clientes.
- **pedidos**:
  - `id` (uuid, PK)
  - `cliente_nombre` (text)
  - `cliente_telefono` (text)
  - `cliente_email` (text)
  - `direccion` (text)
  - `metodo_pago` (text)
  - `metodo_envio` (text)
  - `estado` (text: 'pendiente', 'entregado', etc.)
  - `created_at` (timestamp)
- **detalles_pedido**:
  - `id` (uuid, PK)
  - `pedido_id` (uuid, FK a `pedidos`)
  - `producto_id` (uuid, FK a `productos`)
  - `cantidad` (integer)
  - `precio_unitario` (numeric)

### 5. Vista `vista_catalogo_activo`
Vista optimizada que consume el cliente para renderizar el catálogo público.
- Retorna únicamente los productos con `stock > 0`.

---

## ⚙️ Flujos y Lógica de Negocio

### 🔀 1. Enrutamiento del Lado del Cliente
El enrutamiento se maneja a nivel de estado en el contexto global mediante el parámetro `view` dentro de `CartContext.jsx`.
- Las vistas disponibles son: `home`, `catalog`, `howtobuy`, `contact`, `checkout`, `login` y `admin`.
- Un efecto secundario (`useEffect`) en `App.jsx` bloquea la vista `admin` si el usuario no cuenta con un rol de administrador válido (`admin` o `superadmin`), redirigiéndolo a `login`.

### 🛍️ 2. Lógica del Carrito y WhatsApp Checkout
El estado del carrito (`cart`) se almacena en `localStorage` bajo la clave `katherine_cart`.
Al completar el formulario en `Checkout.jsx`:
1. Se invoca la función RPC de Supabase `crear_pedido_invitado` pasando la información del cliente y los ítems del carrito.
2. La base de datos registra la transacción y descuenta el stock.
3. Se vacía el carrito local.
4. Se redirecciona al cliente a WhatsApp Web con un enlace pre-armado y codificado con el detalle completo de su orden (artículos, método de pago, envío, total y dirección) para que finalice la coordinación de forma directa.

### 🛡️ 3. Roles de Usuario y Autenticación
Supabase Auth gestiona el login. Para verificar si un usuario es administrador, `CartContext.jsx` sigue un flujo de tres niveles:
1. Lee los metadatos del usuario (`app_metadata` / `user_metadata`) bajo el campo `role` o `rol`.
2. Si no existen, consulta la tabla `perfiles` en Supabase buscando la fila coincidente.
3. De lo contrario, consulta la tabla `profiles`.
4. Los roles reconocidos son `admin` y `superadmin`. El superadministrador cuenta con el beneficio exclusivo de poder crear otros usuarios administradores mediante un RPC dedicado (`crear_usuario_admin`).

### 📦 4. Panel de Administración e Inventario
El Control de Inventario (`InventoryPanel.jsx` / `useProducts.js`) permite:
- **Lectura**: Lista de todos los productos y stocks de la tienda.
- **Edición Rápida**: Modificaciones de `precio` y `stock` inline en la misma tabla mediante eventos `onBlur` o tecla `Enter`.
- **Edición Completa (Drawer)**: Formulario interactivo en panel ensanchado de `420px`. Cuenta con tres fases visuales y coloridas (Datos Básicos en violeta, Inventario/Precio en azul e Imagen/Previsualización en verde), área táctil para subida de fotos y un simulador en tiempo real idéntico a las fichas del catálogo del cliente.
- **Procesamiento de Foto (Compresión WebP)**: Al subir una imagen de producto, se utiliza un elemento `<canvas>` en `imageProcessor.js` para redimensionar la imagen a un máximo de 800x800 píxeles, comprimirla con calidad 0.8 en formato **WebP** y transformarla a una cadena Base64 compacta que se almacena directamente en la base de datos, garantizando una carga rápida y de bajo peso en el catálogo del cliente.

---

## 🎨 Decisiones de Rediseño y Experiencia Premium (Mobile-First)

1. **Carrusel del Hero y Anuncios**: Remoción de cualquier redirección de los slides principales. El carrusel y la sección de anuncios ocupan el 100% de la pantalla horizontalmente sin curvas. La sección de anuncios se diseñó con fondo gris neutro minimalista y sin animaciones distractoras.
2. **Iconografía y Secciones Limpias**: Quitado de todo tipo de iconos de colores intensos en las cabeceras del cliente. Las tres cards de categorías del pie de la página se estilizaron con fondos planos gris/zinc discretos.
3. **Timeline Guía de Compras**: Aplicación de colores sutiles y distintivos para los nodos numerados. Responsividad resuelta nativamente mediante CSS (`hidden md:flex`, `block md:hidden`), evitando dependencias de scripts que realicen lecturas en caliente de las dimensiones de la ventana.
4. **Filtros de Doble Nivel**: Agrupación del catálogo por categorías generales (Estética, Moda y Otros) en botones de píldora oscuros, desplegando un segundo nivel dinámico con las subcategorías vinculadas según la selección del usuario.
