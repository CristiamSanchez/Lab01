const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxy (Dokploy / Traefik / Nginx)
app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Endpoints
app.use('/api', apiRoutes);

// Define paths for the 3 compiled frontends
const pwaPath = path.join(__dirname, '../public/pwa');
const adminPath = path.join(__dirname, '../public/admin');
const ecommercePath = path.join(__dirname, '../public/ecommerce');

function hasBuild(dir) {
  return fs.existsSync(path.join(dir, 'index.html'));
}

// 1. Mobile PWA under /app and /app/
app.use('/app', express.static(pwaPath));
app.get(['/app', '/app/*', '/app/'], (req, res) => {
  if (hasBuild(pwaPath)) {
    return res.sendFile(path.join(pwaPath, 'index.html'));
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Hamburger Rapid PWA Mobile</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0c0e; color: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #18181c; padding: 2.5rem; border-radius: 1.5rem; max-width: 500px; text-align: center; border: 1px solid rgba(255, 87, 34, 0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        h2 { color: #ff5722; margin-bottom: 0.5rem; }
        p { color: #9ca3af; line-height: 1.6; }
        code { background: #222228; color: #ff5722; padding: 2px 6px; border-radius: 4px; }
        .btn { display: inline-block; background: #ff5722; color: white; text-decoration: none; padding: 0.75rem 1.75rem; border-radius: 9999px; font-weight: 700; margin-top: 1.25rem; box-shadow: 0 4px 14px rgba(255,87,34,0.4); }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>📱 PWA Mobile en construcción ●</h2>
        <p>Ejecuta <code>npm run build:pwa</code> o <code>npm run build:all</code> para sincronizar los artefactos en <code>server/public/pwa</code>.</p>
        <a class="btn" href="/">Ir a E-commerce</a>
      </div>
    </body>
    </html>
  `);
});

// 2. Control Panel under /admin and /admin/
app.use('/admin', express.static(adminPath));
app.get(['/admin', '/admin/*', '/admin/'], (req, res) => {
  if (hasBuild(adminPath)) {
    return res.sendFile(path.join(adminPath, 'index.html'));
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Hamburger Rapid - Panel Admin</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0c0e; color: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #18181c; padding: 2.5rem; border-radius: 1.5rem; max-width: 500px; text-align: center; border: 1px solid rgba(255, 87, 34, 0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        h2 { color: #ff5722; margin-bottom: 0.5rem; }
        p { color: #9ca3af; line-height: 1.6; }
        code { background: #222228; color: #ff5722; padding: 2px 6px; border-radius: 4px; }
        .btn { display: inline-block; background: #ff5722; color: white; text-decoration: none; padding: 0.75rem 1.75rem; border-radius: 9999px; font-weight: 700; margin-top: 1.25rem; box-shadow: 0 4px 14px rgba(255,87,34,0.4); }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>⚙️ Panel Admin en construcción ●</h2>
        <p>Ejecuta <code>npm run build:admin</code> o <code>npm run build:all</code> para sincronizar los artefactos en <code>server/public/admin</code>.</p>
        <a class="btn" href="/">Ir a E-commerce</a>
      </div>
    </body>
    </html>
  `);
});

// 3. E-commerce Portal on Root /
app.use(express.static(ecommercePath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint API no encontrado' });
  }
  if (hasBuild(ecommercePath)) {
    return res.sendFile(path.join(ecommercePath, 'index.html'));
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Hamburger Rapid - Plataforma Comercial</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0c0e; color: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #18181c; padding: 2.5rem; border-radius: 1.8rem; max-width: 650px; text-align: center; border: 1px solid rgba(255, 87, 34, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.9); }
        h1 { color: #ffffff; margin-bottom: 0.5rem; font-size: 2.2rem; font-weight: 800; }
        .badge { display: inline-block; background: rgba(255, 87, 34, 0.15); color: #ff5722; padding: 0.4rem 1rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 800; margin-bottom: 1.5rem; border: 1px solid rgba(255, 87, 34, 0.35); }
        p { color: #9ca3af; line-height: 1.6; }
        code { background: #222228; color: #ff5722; padding: 2px 6px; border-radius: 4px; }
        .links { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
        .btn { background: #ff5722; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 700; transition: all 0.2s; box-shadow: 0 4px 14px rgba(255,87,34,0.4); }
        .btn:hover { background: #f4511e; }
        .status { text-align: left; background: #141418; padding: 1rem; border-radius: 0.85rem; font-family: monospace; font-size: 0.85rem; margin-top: 1.5rem; border: 1px solid rgba(255,255,255,0.08); color: #e4e4e7; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🍔 Hamburger Rapid</h1>
        <div class="badge">Versión Comercial v1.0 &bull; Dokploy CI/CD ●</div>
        <p>Servidor backend activo. Si estás viendo esta pantalla localmente, ejecuta <code>npm run build:all</code> para compilar las 3 capas, o despliega en Dokploy usando el <code>Dockerfile</code>.</p>
        <div class="links">
          <a class="btn" href="/app/">📱 PWA Mobile</a>
          <a class="btn" style="background:#2b2b34; border:1px solid rgba(255,255,255,0.1);" href="/admin/">⚙️ Panel Admin</a>
          <a class="btn" style="background:#10b981;" href="/api/health">🩺 Health Check</a>
          <a class="btn" style="background:#ff5722;" href="/api/products">📦 API Productos</a>
          <a class="btn" style="background:#8b5cf6;" href="/api/metrics">📊 API Métricas</a>
        </div>
        <div class="status">
          <div>• Puerto: ${PORT}</div>
          <div>• Estado DB: ${db.getDbStatus().mode}</div>
          <div>• Entorno: ${process.env.NODE_ENV || 'development'}</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Start server and initialize DB
async function start() {
  await db.initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🍔 Hamburger Rapid Platform ejecutándose en puerto ${PORT}`);
    console.log(`   - E-commerce:  http://localhost:${PORT}/`);
    console.log(`   - PWA Mobile:  http://localhost:${PORT}/app/`);
    console.log(`   - Panel Admin: http://localhost:${PORT}/admin/`);
    console.log(`   - API Health:  http://localhost:${PORT}/api/health`);
    console.log(`   - API Metrics: http://localhost:${PORT}/api/metrics`);
    console.log(`=======================================================`);
  });
}

start();
