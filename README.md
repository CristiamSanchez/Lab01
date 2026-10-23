# 🍔 Hamburger Rapid &bull; Versión Comercial v1.0

Plataforma comercial full-stack de comida rápida gourmet optimizada para despliegue automatizado en **Dokploy CI/CD**, compuesta por una arquitectura desacoplada de 3 aplicaciones front-end servidas por un backend Node.js unificado y persistencia tolerante a fallos.

---

## 🏗️ Arquitectura de la Solución

```text
scaffold_base/
├── Dockerfile                  # Multi-stage Docker build (Astro, Vite PWA, Vite Admin, Node.js)
├── package.json                # Scripts raíz de orquestación y sincronización
├── apps/
│   ├── ecommerce/              # Landing page comercial (Astro 4) -> Ruta: /
│   ├── pwa/                    # Aplicación móvil PWA (React 18 + Vite) -> Ruta: /app/
│   └── admin/                  # Dashboard administrativo (React 18 + Vite) -> Ruta: /admin/
└── server/                     # Backend Node.js / Express con API REST y conector MySQL
    └── src/
        ├── app.js              # Servidor HTTP y router de activos estáticos
        ├── db.js               # Conexión dual MySQL / In-Memory con catálogo de 10 burgers
        └── routes/api.js       # Endpoints REST (/api/products, /api/metrics, /api/orders, /api/health)
```

---

## ✨ Características Implementadas

### 1. E-commerce (`apps/ecommerce`) &bull; Ruta `/`
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
- **Modal interactivo de detalles**: composición artesanal, tabla nutricional y tiempo de preparación.
- **Filtros dinámicos por categoría**: Especiales, Clásicas, Gourmet y Pollo.
- **Paleta clara premium**: fondos marfil/blanco con acentos dorados y ámbar.

### 2. PWA Mobile (`apps/pwa`) &bull; Ruta `/app/`
- **Barra de navegación inferior fija**:
  - `Menú`: catálogo dinámico con modal de personalización (punto de carne, extras y toppings).
  - `Ofertas`: combos activos y cupones de descuento (`RAPID25`, `RAPIDFREE`).
  - `Órdenes`: rastreador interactivo de 4 pasos (*Recibida &rarr; En Parrilla &rarr; En Camino &rarr; Entregada*), temporizador y reordenado.
  - `Perfil`: cuenta de cliente VIP Platinum, balance de recompensas RapidCoins e instalación de la PWA.
- **Carrito y Checkout simulado**: cálculo de subtotal, envío gratis y cupones.

### 3. Panel Admin (`apps/admin`) &bull; Ruta `/admin/`
- **Métricas de Consumidores**:
  - KPI de facturación, volumen de pedidos, ticket promedio y satisfacción del cliente.
  - Segmentación de clientes según nivel de consumo (*VIP Platinum, Frecuentes Gold, Ocasionales Silver, Nuevos Bronce*).
  - Tabla de los Top 5 Clientes Consumidores del Mes.
  - Ranking de hamburguesas más consumidas y curva de picos horarios.
- **Gestión de Hamburguesas**:
  - Listado con filtros en tiempo real y ajuste inline de stock (+/-).
  - Modal para dar de alta nuevas hamburguesas en caliente.
  - Eliminación y restablecimiento de datos demo.
- **Monitor de Base de Datos**:
  - Estado de conexión MySQL vs modo de tolerancia In-Memory.

---

## 🚀 Comandos de Construcción y Ejecución

```bash
# 1. Instalar dependencias en todos los subproyectos
npm run install:all

# 2. Compilar individualmente
npm run build:ecommerce
npm run build:pwa
npm run build:admin

# 3. Compilación completa y sincronización hacia server/public
npm run build:all

# 4. Iniciar servidor de producción unificado
npm run start
```