# 🍔 Hamburger Rapid &bull; Versión Comercial v2.0 (Hamburgesin UI Edition)

Plataforma comercial full-stack de comida rápida gourmet optimizada para despliegue automatizado en **Dokploy CI/CD**, compuesta por una arquitectura desacoplada de 3 aplicaciones front-end servidas por un backend Node.js unificado, persistencia tolerante a fallos, autenticación corporativa nativa con **Hamburger Rapid Central Suite**, y una interfaz visual moderna basada en la referencia de diseño **Hamburgesin UI**.

---

## 🎨 Referencia de Diseño e Identidad Visual (Hamburgesin UI)

La interfaz de usuario del **Landing E-commerce** (`apps/ecommerce`), la **PWA Mobile** (`apps/pwa`) y el **Panel de Administración** (`apps/admin`) comparten una estética visual uniforme inspirada en la maqueta de referencia:

* **Ubicación del recurso:** La imagen tomada como referencia oficial se encuentra en el directorio **`assets/`** bajo el nombre **`Hamburgesin.png`** (disponible también en `server/Assets/Hamburgesin.png` y servida estáticamente en `/assets/Hamburgesin.png`).
* **Paleta de Colores Contrastada:**
  - **Fondo Deep Obsidian:** `#0c0c0e` para un ambiente moderno, elegante y de alta fidelidad.
  - **Superficies y Tarjetas:** Grafito oscuro `#18181c` y `#222228` con bordes sutiles `rgba(255, 255, 255, 0.08)`.
  - **Color Acento Primario:** Naranja fuego cálido `#ff5722` (resplandores, precios, botones primarios e indicadores).
  - **Contraste Secundario:** Blanco puro `#ffffff` en tipografías y botones secundarios.
  - **Textos de Lectura:** Blanco `#ffffff` para títulos y gris plata `#9ca3af` para ingredientes y descripciones.
* **Componentes y Elementos de Interfaz:**
  - **Botones Pill (Píldora):** Curvatura completa (`border-radius: 9999px`) en todas las llamadas a la acción (`Pedir en App PWA`, `Ver 10 Obras Maestras`, `Acceder al Panel de Control ➔`).
  - **Buscador Blanco Flotante Pill:** Buscador interactivo en tiempo real con fondo blanco y esquinas redondeadas completas, inspirado en la pantalla de catálogo de la maqueta.
  - **Indicadores Dot Circulares (`●`):** Puntos de acento naranja en los títulos de categorías y especialidades.

---

## 🏗️ Arquitectura de la Solución

```text
scaffold_base/
├── Dockerfile                  # Multi-stage Docker build (Astro, Vite PWA, Vite Admin, Node.js)
├── package.json                # Scripts raíz de orquestación y sincronización (build, start)
├── assets/
│   └── Hamburgesin.png         # Imagen de referencia visual UI adoptada en el Landing E-commerce
├── apps/
│   ├── ecommerce/              # Landing page comercial (Astro 4) -> Ruta: / (Hamburgesin UI)
│   ├── pwa/                    # Aplicación móvil PWA (React 18 + Vite) -> Ruta: /app/
│   └── admin/                  # Dashboard administrativo (React 18 + Vite) -> Ruta: /admin/
└── server/                     # Backend Node.js / Express con API REST y MySQL Datamart
    ├── Assets/                 # Copia de recursos de diseño (Hamburgesin.png)
    ├── public/                 # Artefactos compilados estáticos sincronizados
    └── src/
        ├── app.js              # Servidor HTTP con enrutamiento tolerante para SPA /app y /admin
        ├── db.js               # Conexión dual MySQL / In-Memory con catálogo de 10 burgers
        ├── services/
        │   └── authService.js  # Servicio corporativo de autenticación, perfil y telemetría
        └── routes/
            └── api.js          # Endpoints REST (/api/auth/*, /api/products, /api/metrics, /api/orders)
```

---

## 🔐 Módulo de Autenticación Corporativa y Control de Acceso

El acceso al **Panel de Administración** se realiza de forma directa, simple y transparente mediante **Hamburger Rapid Central Suite**:

* **Pantalla de Inicio de Sesión (Tasty Bites / Central):**
  - Tarjeta dark obsidian con corona dorada `👑` y resplandor ámbar.
  - Entradas en píldora blanca ergonómicas para `USUARIO / CORREO CORPORATIVO` y `CONTRASEÑA DE ACCESO`.
  - Botón pill en gradiente naranja cálido: `Acceder al Panel de Control ➔`.
  - Credenciales demo preconfiguradas: `admin @ gardenworld.com` / `GardenAdmin` (o cualquier usuario corporativo autorizado).
* **Endpoints Centrales:**
  - `POST /api/auth/login`: Validación directa de credenciales en un solo paso sin configuraciones complejas.
  - `GET /api/auth/verify`: Verificación de tokens de sesión activos.
  - `POST /api/auth/logout`: Revocación segura de tokens.
  - `GET /api/auth/config`: Obtención de parámetros del servidor central y blindaje de conexión.
  - `POST /api/auth/ping`: Prueba interactiva de latencia y conectividad del servidor corporativo.

---

## ✨ Características de las Aplicaciones

### 1. E-commerce (`apps/ecommerce`) &bull; Ruta `/`
- **Nuevo estilo visual Hamburgesin UI**: Paleta dark obsidian `#0c0c0e`, botones pill naranja `#ff5722` y blanco `#ffffff`, e indicadores de sección circulares dot (`●`).
- **Buscador en tiempo real**: Filtro instantáneo por nombre, ingrediente o especialidad con barra pill blanca flotante.
- **Catálogo de 10 Hamburguesas Maestras**:
  - `Rey de las Burgers` (👑 Firma de la Casa - $15.99)
  - `Burger Real Clásica` (⭐ Clásica Destacada - $10.99)
  - `Burger Real Doble` (🔥 Doble Corona - $13.99)
  - `Burger Doble Especial` (💎 Ultra Especial - $14.50)
  - `Smash Trufa Imperial` (🥇 Selección Gourmet - $16.99)
  - `Crispy Smokehouse Chicken` (🍗 Crujiente Maestro - $11.99)
  - `Bacon BBQ Supreme` (🥓 Favorita Ahumada - $13.50)
  - `Volcán Cheddar Melt` (🧀 Explosión de Queso - $14.99)
  - `Veggie Portobello Gourmet` (🌱 100% Plant & Earth - $12.50)
  - `Triple Fuego Habanero` (🌶️ Ultra Spicy Fuego - $15.50)
- **Modal interactivo en modo oscuro**: composición artesanal, tabla nutricional y tiempo de preparación.
- **Filtros por categoría**: Todas, Especiales de la Casa, Clásicas & Dobles, Gourmet & Pollo.
- **Sección de Exhibición UI**: Muestra la referencia visual `assets/Hamburgesin.png` y explica los principios de diseño aplicados.

### 2. PWA Mobile (`apps/pwa`) &bull; Ruta `/app/`
- Enrutamiento optimizado para `/app/` con Service Worker registrado (estrategia Network-First con fallback a caché).
- **Barra de navegación inferior fija**:
  - `Menú`: catálogo dinámico con modal de personalización (punto de carne, extras y toppings).
  - `Ofertas`: combos activos y cupones de descuento (`RAPID25`, `RAPIDFREE`).
  - `Órdenes`: rastreador interactivo de 4 pasos (*Recibida &rarr; En Parrilla &rarr; En Camino &rarr; Entregada*), temporizador y reordenado.
  - `Perfil`: cuenta de cliente VIP Platinum, balance de recompensas RapidCoins e instalación de la PWA.
- **Carrito y Checkout simulado**: cálculo de subtotal, envío gratis y cupones con soporte de tipos float numéricos.

### 3. Panel Admin (`apps/admin`) &bull; Ruta `/admin/`
El panel incorpora la arquitectura modular de 4 pestañas requerida:
1. **🍔 Catálogo de Hamburguesas (10)**:
   - Tabla interactiva con búsqueda en vivo, filtros por categoría y stock dinámico (+/-).
   - Modal para creación de nuevas hamburguesas en caliente.
   - Eliminación y restablecimiento de datos.
2. **👥 Métricas de Consumidores / Clientes (1480)**:
   - Resumen KPI de ventas, volumen de pedidos, ticket promedio y satisfacción.
   - Segmentación de clientes según nivel de consumo (*VIP Platinum, Frecuentes Gold, Ocasionales Silver, Nuevos Bronce*).
   - Tabla de los Top Clientes Más Fieles y ranking de consumo.
3. **📊 Estado de la Base de Datos & Telemetría**:
   - Monitoreo en tiempo real del motor activo (MySQL Server con fallback transparente a SQLite Datamart).
   - Medición de latencia interactiva con botón `⚡ Ping DB`.
   - Diagnóstico de tablas y registros indexados (`products`, `customers`, `orders`, `analytics`).
   - Visor de payload de telemetría JSON en vivo (`/api/health`).
4. **👤 Perfil & Conexión**:
   - Resumen de sesión activa con usuario, ID, organización, rol y almacén asignado.
   - Blindaje de conexión del servidor central con URL configurable y proxy CORS.
   - Botón interactivo de prueba de conectividad `⚡ Probar Conectividad de Servidor`.
   - Selector del modo de autenticación (Login Directo en 1 Paso o Modo Asistido Multi-Tenant).
   - Parámetros predeterminados de conexión protegidos.

---

## 🚀 Comandos de Construcción y Ejecución

```bash
# 1. Instalar dependencias en todos los subproyectos
npm run install:all

# 2. Compilación completa y sincronización limpia hacia server/public
npm run build:all

# 3. Iniciar el servidor local
npm run start
```