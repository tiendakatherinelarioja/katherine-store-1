---

A continuación, te presento el informe técnico completo en formato Markdown (`.md`). Podés copiar y pegar este contenido directamente en un archivo llamado `README.md` o `INFORME_PROYECTO.md` para tener toda la documentación estructurada de tu proyecto.

Markdown

# 

```
# Documento de Especificación Técnica: E-commerce Consultivo con Cierre en WhatsApp

Este documento detalla la arquitectura, el modelo de datos, la estructura de carpetas y las estrategias de optimización para el desarrollo de la plataforma de comercio electrónico orientada a los rubros de maquillaje, manicura, ropa, accesorios y termos.

El sistema se basa en un catálogo interactivo con prioridad móvil (*Mobile-First*), donde el proceso de compra finaliza mediante un formulario de contacto y la venta se concreta de forma humana y consultiva a través de WhatsApp.

---

## 1. Arquitectura y Stack Tecnológico

La infraestructura está diseñada para ser completamente escalable, optimizar los recursos de los planes gratuitos y evitar el *vendor lock-in*, permitiendo una migración fluida a un servidor propio (VPS) en el futuro.

* **Frontend (Hosting en Vercel):** React (utilizando Next.js) + Tailwind CSS.
    * *Nota:* Se prefiere Next.js para aprovechar el renderizado del lado del servidor (SSR) y optimizar el SEO dinámico del catálogo de productos.
* **Backend & Base de Datos (Supabase Cloud):** * **PostgreSQL:** Motor relacional para un control estricto de concurrencia y stock en tiempo real.
    * **Supabase Auth:** Gestión de sesiones segura para el acceso al módulo de administración.
    * **Realtime (WebSockets):** Sincronización inmediata de nuevos pedidos en el Dashboard.
* **Servicios Externos:** Resend o SendGrid para la automatización de alertas por correo electrónico hacia los administradores.

---

## 2. Estrategia de Optimización en Base de Datos (PostgreSQL)

Para reducir las peticiones de red y minimizar el consumo de CPU y batería en dispositivos móviles, la lógica pesada se delega al servidor mediante Vistas y Procedimientos Almacenados (RPC).

### A. Vistas Precalculadas (Views)
* `vista_catalogo_activo`: Retorna únicamente los productos con `stock > 0` y extrae solo las columnas esenciales para las tarjetas del grid (ID, nombre, precio, imagen_url, categoría), omitiendo descripciones extensas para acelerar la carga en redes móviles.
* `vista_estadisticas_admin`: Agrupa las ventas por producto y categoría cruzando `detalles_pedido` y `productos`. El Dashboard consume este recurso con una sola petición.

### B. Procedimiento Almacenado (Transacción Atómica RPC)
Para cumplir con la reserva de stock inmediato al finalizar el pedido, se utiliza la función `crear_pedido_invitado`. Esto previene condiciones de carrera (evita que dos usuarios compren el último artículo simultáneamente).

```sql
CREATE OR REPLACE FUNCTION crear_pedido_invitado(
  cliente_info JSONB,
  items_carrito JSONB
) RETURNS VOID AS $$
DECLARE
  item RECORD;
  nuevo_pedido_id UUID;
BEGIN
  -- 1. Verificar stock disponible en el servidor
  FOR item IN SELECT * FROM jsonb_to_recordset(items_carrito) AS x(producto_id UUID, cantidad INT) LOOP
    IF (SELECT stock FROM productos WHERE id = item.producto_id) < item.cantidad THEN
      RAISE EXCEPTION 'Stock insuficiente para el producto %', item.producto_id;
    END IF;
  END LOOP;

  -- 2. Insertar encabezado del pedido
  INSERT INTO pedidos (cliente_nombre, cliente_telefono, cliente_email, direccion, metodo_pago, metodo_envio, estado)
  VALUES (
    cliente_info->>'nombre',
    cliente_info->>'telefono',
    cliente_info->>'email',
    cliente_info->>'direccion',
    cliente_info->>'metodo_pago',
    cliente_info->>'metodo_envio',
    'pendiente'
  ) RETURNING id INTO nuevo_pedido_id;

  -- 3. Insertar detalles y restar stock físico
  FOR item IN SELECT * FROM jsonb_to_recordset(items_carrito) AS x(producto_id UUID, cantidad INT, precio_unitario DECIMAL) LOOP
    INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario)
    VALUES (nuevo_pedido_id, item.producto_id, item.cantidad, item.precio_unitario);

    UPDATE productos
    SET stock = stock - item.cantidad
    WHERE id = item.producto_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## 3. Estructura de Carpetas del Proyecto (Frontend)

Para asegurar componentes reutilizables, separación de conceptos (*Clean Architecture*) y una migración sencilla hacia un VPS, se establece la siguiente distribución en React/Next.js:

Plaintext

# 

```
src/
├── components/          # Componentes visuales atómicos y reutilizables
│   ├── ui/              # Elementos base de diseño (Button, Input, Badge, Modal, Drawer)
│   ├── product/         # Lógica visual de productos (ProductCard, ProductGrid, ProductFilters)
│   ├── cart/            # Interfaz del carrito (CartDrawer, CartItem, CartSummary)
│   └── navigation/      # Elementos de desplazamiento (Navbar, MobileSidebar, Footer)
├── context/             # Manejo de estados globales (Independientes del proveedor)
│   └── CartContext.jsx  # Control del carrito (Sincronizado con LocalStorage para invitados)
├── hooks/               # Custom Hooks para desacoplar la lógica de las vistas
│   ├── useProducts.js   # Gestión de fetch y filtros de la vista de catálogo
│   └── useOrders.js     # Manejo de estados y mutaciones de pedidos (Admin y Cliente)
├── services/            # Capa de Infraestructura de Red (Aislada)
│   └── supabaseClient.js# Configuración de Supabase. Al migrar a VPS, solo se modifica este archivo.
├── utils/               # Funciones utilitarias y helpers independientes
│   └── imageProcessor.js# Script de conversión y compresión de imágenes a WebP
└── views/               # Pantallas completas/Páginas del sistema
    ├── client/          # Entorno del cliente
    │   ├── Home.jsx     # Landing page con acceso directo al catálogo
    │   ├── Catalog.jsx  # Filtros, categorías y scroll infinito para móviles
    │   └── Checkout.jsx # Formulario de datos de contacto y cierre de orden
    └── admin/           # Entorno de Gestión Full-Screen
        ├── AdminLayout.jsx   # Estructura general de escritorio (Sidebar expandido)
        ├── OrdersPanel.jsx   # Tabla en tiempo real (Realtime), filtros y Drawer de acciones
        ├── InventoryPanel.jsx# Control de Stock rápido (inputs interactivos con onBlur)
        └── AnalyticsPanel.jsx# Gráficos dinámicos basados en la vista de estadísticas
```

## 4. Procesamiento Automático de Imágenes a `.webp`

Para optimizar el almacenamiento gratuito en Supabase (límite de 1 GB) y reducir la transferencia de datos en teléfonos móviles, las imágenes se transforman del lado del cliente (*Frontend*) antes de ser enviadas al Storage.

**Flujo Operativo:**

1. El administrador adjunta una foto (`.png`, `.jpg`, `.jpeg`) de cualquier peso en el panel de carga.
2. La función utilitaria procesa el archivo mediante un elemento HTML5 `Canvas`, reduciendo las dimensiones y modificando el formato.
3. Se genera un archivo comprimido `.webp` (calidad recomendada: 80%) reduciendo un archivo original de 4 MB a solo ~120 KB sin pérdida perceptible de fidelidad visual.
4. El Frontend sube el archivo optimizado directamente a Supabase Storage.

## 5. Diseño del Módulo Administrador (Dashboard Full-Screen)

El panel administrativo ocupa el 100% de la pantalla (`w-screen h-screen`) y está diseñado para una gestión operativa ágil en PC o tablets:

1. **Pedidos en Tiempo Real:** Activando el canal *Realtime* de Supabase, los nuevos pedidos de usuarios invitados se renderizan al instante en la lista de pendientes mediante WebSockets, acompañados de alertas sonoras opcionales.
2. **Panel de Acciones (Drawer Lateral):** Al seleccionar una orden, se despliega la información del cliente y tres disparadores principales:
    - *Botón Aceptar/Rechazar:* Cambia el estado del pedido. Si se cancela/rechaza, un Trigger en PostgreSQL restituye las unidades retenidas al stock general de inmediato.
    - *Botón Exportar PDF:* Genera un remito comercial estructurado del pedido usando librerías del cliente (`@react-pdf/renderer` o `jspdf`).
    - *Enlace Directo a WhatsApp:* Abre una nueva pestaña parametrizada con la API de WhatsApp (`wa.me/telefono?text=...`) incluyendo un saludo y el detalle completo del pedido pre-formateado para coordinar el pago.
3. **Control Rápido de Inventario:** Modificación del stock mediante inputs numéricos directos vinculados al evento `onBlur`. Al salir del foco o presionar *Enter*, se realiza la actualización inmediata en la base de datos de manera transparente para el operador.

## 6. Hoja de Ruta para Migración Futura a VPS (Docker/Dokku)

Gracias a las decisiones de diseño arquitectónico tomadas, la migración desde las plataformas Serverless (Vercel/Supabase Cloud) hacia un servidor privado virtual (VPS) no requerirá refactorizaciones en el código fuente:

- **Migración de Base de Datos:** Al ser PostgreSQL nativo, se extrae un volcado estándar (`.sql`) desde Supabase Cloud y se monta en un contenedor Docker con Postgres en el nuevo VPS.
- **Migración del Frontend:** Se añade un archivo `Dockerfile` estándar al repositorio para empaquetar la aplicación de React/Next.js. Plataformas autohospedadas como Dokku o Coolify compilan y sirven el contenedor automáticamente aplicando Nginx y certificados SSL (Let's Encrypt).
- **Aislamiento de Variables:** El Frontend se vincula exclusivamente a variables de entorno (`SUPABASE_URL`, `SUPABASE_KEY`). Para completar la migración, solo se requiere cambiar los valores de estas variables en las configuraciones del nuevo hosting para apuntar al VPS propio.
- `**
### 💡 Sugerencia de uso
Si estás utilizando herramientas de control de versiones como Git, podés guardar este texto en la raíz de tu proyecto como `README.md`. De esta forma, cualquier persona que acceda al repositorio (o vos mismo en el futuro) comprenderá inmediatamente la arquitectura de la aplicación y las reglas de negocio acordadas con el cliente.`