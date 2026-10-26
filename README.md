# 🍔 Hamburger Rapid &bull; Versión Comercial v2.0 (Hamburgesin UI Edition)

Plataforma comercial full-stack de comida rápida gourmet optimizada para despliegue automatizado en **Dokploy CI/CD**, compuesta por una arquitectura desacoplada de 3 aplicaciones front-end servidas por un backend Node.js unificado, persistencia tolerante a fallos, autenticación centralizada con **iDempiere ERP REST API v1**, y una nueva capa visual para el **Landing E-commerce** basada en la referencia de diseño **Hamburgesin UI**.

---

## 🎨 Referencia de Diseño e Identidad Visual (Hamburgesin UI)

La interfaz de usuario del **Landing E-commerce** (`apps/ecommerce`) ha sido actualizada para adoptar la estética, paleta de colores y componentes visuales de la imagen de referencia:

* **Ubicación del recurso:** La imagen tomada como referencia oficial se encuentra en el directorio **`assets/`** bajo el nombre **`Hamburgesin.png`** (disponible también en `server/Assets/Hamburgesin.png` y servida estáticamente en `/assets/Hamburgesin.png`).
* **Paleta de Colores Contrastada:**
  - **Fondo Deep Obsidian:** `#0c0c0e` para un ambiente moderno, elegante y de alta fidelidad.
  - **Superficies y Tarjetas:** Grafito oscuro `#18181c` y `#222228` con bordes sutiles `rgba(255, 255, 255, 0.08)`.
  - **Color Acento Primario:** Naranja fuego cálido `#ff5722` (resplandores, precios, botones primarios e indicadores).
  - **Contraste Secundario:** Blanco puro `#ffffff` en tipografías y botones secundarios.
  - **Textos de Lectura:** Blanco `#ffffff` para títulos y gris plata `#9ca3af` para ingredientes y descripciones.
* **Componentes y Elementos de Interfaz:**
  - **Botones Pill (Píldora):** Curvatura completa (`border-radius: 9999px`) en todas las llamadas a la acción (`Pedir en App PWA`, `Ver 10 Obras Maestras`, `Ver Detalles`, `Ordenar`).
  - **Buscador Blanco Flotante Pill:** Buscador interactivo en tiempo real con fondo blanco y esquinas redondeadas completas, inspirado en la pantalla de catálogo de la maqueta.
  - **Indicadores Dot Circulares (`●`):** Puntos de acento naranja en los títulos de categorías y especialidades.
  - **Mockup Interactivo:** Vista previa en la sección Hero que recrea la experiencia móvil de la referencia.

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
└── server/                     # Backend Node.js / Express con API REST, MySQL e iDempiere
    ├── Assets/                 # Copia de recursos de diseño (Hamburgesin.png)
    ├── public/                 # Artefactos compilados estáticos sincronizados
    └── src/
        ├── app.js              # Servidor HTTP con enrutamiento tolerante para SPA /app y /admin
        ├── db.js               # Conexión dual MySQL / In-Memory con catálogo de 10 burgers
        ├── services/
        │   └── idempiereService.js  # Servicio de autenticación iDempiere ERP REST API v1
        └── routes/
            └── api.js          # Endpoints REST (/api/auth/*, /api/products, /api/metrics, /api/orders)
```

---

## 🔐 Módulo de Autenticación iDempiere ERP REST API v1

Cumple estrictamente con las directivas técnicas de iDempiere:
* **Endpoint de Tokens**: `POST /api/v1/auth/tokens` (plural `/tokens`, nunca `/token`).
* **Cabeceras HTTP Obligatorias**:
  - `Content-Type: application/json`
  - `Accept: application/json`
* **Payload JSON (Login Directo / 1 Paso)**:
```json
{
  "userName": "admin @ gardenworld.com",
  "password": "GardenAdmin",
  "parameters": {
    "clientId": 11,
    "roleId": 102,
    "organizationId": 11,
    "warehouseId": 103,
    "language": "en_US"
  }
}
```
* **Tolerancia a fallos**: Si el servidor iDempiere externo no está accesible (timeout o desconexión), se activa automáticamente un modo de contingencia que valida las credenciales autorizadas y emite un token de contingencia para no bloquear el acceso operativo.

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
- **Acceso Protegido por iDempiere**: pantalla de login con soporte para credenciales directas y parámetros de contexto ERP.
- **Métricas de Consumidores**:
  - KPI de facturación, volumen de pedidos, ticket promedio y satisfacción del cliente.
  - Segmentación de clientes según nivel de consumo (*VIP Platinum, Frecuentes Gold, Ocasionales Silver, Nuevos Bronce*).
  - Tabla de los Top 5 Clientes Consumidores del Mes.
  - Ranking de hamburguesas más consumidas y curva de picos horarios.
- **Gestión de Hamburguesas**:
  - Listado con filtros en tiempo real y ajuste inline de stock (+/-).
  - Modal para dar de alta nuevas hamburguesas en caliente.
  - Eliminación y restablecimiento de datos demo.
- **Monitor de Base de Datos y ERP**:
  - Estado de conexión iDempiere ERP v1 y base de datos MySQL / In-Memory.

---

## 🚀 Comandos de Construcción y Ejecución

```bash
# 1. Instalar dependencias en todos los subproyectos
npm run install:all

# 2. Compilación completa y sincronización limpia hacia server/public
npm run build:all

# 3. Iniciar servidor de producción unificado
npm run start
```