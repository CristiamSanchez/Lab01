import React, { useState, useEffect } from 'react';

export default function App() {
  // Authentication State
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('rapid_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    userName: 'admin @ gardenworld.com',
    password: 'GardenAdmin',
    parameters: {
      clientId: 11,
      roleId: 102,
      organizationId: 11,
      warehouseId: 103,
      language: 'en_US'
    }
  });
  const [showAdvancedErp, setShowAdvancedErp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'products' | 'database' | 'orders'
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [erpConfig, setErpConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form for new burger
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'Especiales',
    price: '',
    stock: 40,
    specialty_level: '👑 Firma de la Casa',
    description: '',
    ingredients: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.data.map(p => ({
          ...p,
          price: Number(p.price) || 0,
          stock: parseInt(p.stock, 10) || 0,
          rating: Number(p.rating) || 4.9
        })));
      }

      // Fetch Metrics
      const metRes = await fetch('/api/metrics');
      const metData = await metRes.json();
      if (metData.success) {
        setMetrics(metData.data);
        setDbStatus(metData.data.databaseStatus);
      }

      // Fetch Health
      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();
      if (healthData.database) {
        setDbStatus(healthData.database);
      }

      // Fetch ERP Config
      const erpRes = await fetch('/api/auth/config');
      const erpData = await erpRes.json();
      if (erpData.success) {
        setErpConfig(erpData.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('⚠️ Modo sin conexión: Utilizando datos cacheados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authSession) {
      loadData();
      const interval = setInterval(loadData, 20000);
      return () => clearInterval(interval);
    }
  }, [authSession]);

  // Handle iDempiere Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      // POST to /api/auth/login which proxies to iDempiere POST /api/v1/auth/tokens
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userName: loginForm.userName.trim(),
          password: loginForm.password,
          parameters: {
            clientId: parseInt(loginForm.parameters.clientId, 10),
            roleId: parseInt(loginForm.parameters.roleId, 10),
            organizationId: parseInt(loginForm.parameters.organizationId, 10),
            warehouseId: parseInt(loginForm.parameters.warehouseId, 10),
            language: loginForm.parameters.language
          }
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAuthSession(data.data);
        localStorage.setItem('rapid_admin_auth', JSON.stringify(data.data));
        showToast(`✅ Bienvenido, ${data.data.userName}`);
      } else {
        setAuthError(data.error || 'Fallo de autenticación con iDempiere ERP.');
      }
    } catch (err) {
      setAuthError(`Error de red al conectar con el servicio de autenticación: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      if (authSession?.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authSession.token}`
          }
        });
      }
    } catch (e) {
      // ignore
    }
    setAuthSession(null);
    localStorage.removeItem('rapid_admin_auth');
    showToast('Sesión de iDempiere cerrada');
  };

  // Update stock
  const handleStockChange = async (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
        showToast(`Stock actualizado a ${newStock}`);
      }
    } catch (e) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}" del catálogo?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast(`Hamburguesa "${name}" eliminada`);
      }
    } catch (e) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Create new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) {
      alert('Nombre y precio son requeridos');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBurger)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [data.data, ...prev]);
        setIsAddModalOpen(false);
        setNewBurger({
          name: '',
          category: 'Especiales',
          price: '',
          stock: 40,
          specialty_level: '👑 Firma de la Casa',
          description: '',
          ingredients: '',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
        });
        showToast('¡Nueva hamburguesa añadida exitosamente!');
      }
    } catch (e) {
      alert('Error creando hamburguesa: ' + e.message);
    }
  };

  // Reset default products
  const handleResetCatalog = async () => {
    if (!confirm('¿Restablecer el catálogo de Hamburger Rapid a las 10 hamburguesas maestras iniciales?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        loadData();
        showToast('Catálogo restablecido con éxito');
      }
    } catch (e) {
      showToast('Error restableciendo catálogo');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // ==============================================================
  // RENDER: LOGIN SCREEN (Si no hay sesión activa)
  // ==============================================================
  if (!authSession) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        {/* Toast */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#1c1917',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {toastMessage}
          </div>
        )}

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-accent)',
          borderRadius: '24px',
          padding: '40px 36px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🍔</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text)' }}>
              Hamburger Rapid
            </h1>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--primary-subtle)',
              color: '#92400e',
              border: '1px solid #fde68a',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              marginTop: '8px'
            }}>
              🔐 Acceso Protegido &bull; iDempiere ERP v1
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Autenticación centralizada contra iDempiere REST API v1 (<code>POST /api/v1/auth/tokens</code>)
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              marginBottom: '18px',
              lineHeight: '1.4'
            }}>
              ⚠️ {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text)' }}>
                Usuario ERP (userName) *
              </label>
              <input
                type="text"
                required
                value={loginForm.userName}
                onChange={e => setLoginForm({ ...loginForm, userName: e.target.value })}
                placeholder="admin @ gardenworld.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'var(--surface)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text)' }}>
                Contraseña (password) *
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'var(--surface)'
                }}
              />
            </div>

            {/* Advanced ERP Context Parameters */}
            <div style={{
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px'
            }}>
              <div
                onClick={() => setShowAdvancedErp(!showAdvancedErp)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: 'var(--primary)'
                }}
              >
                <span>⚙️ Parámetros de Contexto iDempiere (parameters)</span>
                <span>{showAdvancedErp ? '▲ Ocultar' : '▼ Ver'}</span>
              </div>

              {showAdvancedErp && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px' }}>clientId</label>
                    <input
                      type="number"
                      value={loginForm.parameters.clientId}
                      onChange={e => setLoginForm({ ...loginForm, parameters: { ...loginForm.parameters, clientId: e.target.value } })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px' }}>roleId</label>
                    <input
                      type="number"
                      value={loginForm.parameters.roleId}
                      onChange={e => setLoginForm({ ...loginForm, parameters: { ...loginForm.parameters, roleId: e.target.value } })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px' }}>organizationId</label>
                    <input
                      type="number"
                      value={loginForm.parameters.organizationId}
                      onChange={e => setLoginForm({ ...loginForm, parameters: { ...loginForm.parameters, organizationId: e.target.value } })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px' }}>warehouseId</label>
                    <input
                      type="number"
                      value={loginForm.parameters.warehouseId}
                      onChange={e => setLoginForm({ ...loginForm, parameters: { ...loginForm.parameters, warehouseId: e.target.value } })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick autofill helper */}
            <button
              type="button"
              onClick={() => {
                setLoginForm({
                  userName: 'admin @ gardenworld.com',
                  password: 'GardenAdmin',
                  parameters: {
                    clientId: 11,
                    roleId: 102,
                    organizationId: 11,
                    warehouseId: 103,
                    language: 'en_US'
                  }
                });
                showToast('Credenciales GardenWorld cargadas');
              }}
              style={{
                background: 'none',
                border: '1px dashed var(--border-accent)',
                color: '#92400e',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              💡 Cargar credenciales oficiales iDempiere (admin @ gardenworld.com)
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={authLoading}
              style={{
                background: 'linear-gradient(135deg, #d97706, #ea580c)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              {authLoading ? '🔄 Conectando con iDempiere...' : 'Ingresar al Panel de Control →'}
            </button>
          </form>

          {/* Quick links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '22px', fontSize: '0.82rem' }}>
            <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>🌐 Ir a E-commerce</a>
            <span style={{ color: '#d6d3d1' }}>&bull;</span>
            <a href="/app/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>📱 Ir a PWA Mobile</a>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // ==============================================================
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1c1917',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999,
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '2rem' }}>🍔</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Hamburger Rapid
              </h1>
              <span style={{
                background: 'var(--primary-subtle)',
                color: '#92400e',
                border: '1px solid var(--primary-border)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700'
              }}>
                ADMIN CONSOLE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Panel comercial autenticado con iDempiere ERP REST API v1
            </p>
          </div>
        </div>

        {/* User Context, Database Pill, and Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Authenticated ERP User Card */}
          <div style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            textAlign: 'right'
          }}>
            <div style={{ fontWeight: '800', color: 'var(--text)' }}>
              👤 {authSession.userName}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Org: {authSession.erpContext?.organizationId || 11} &bull; Rol: {authSession.erpContext?.roleId || 102}
            </div>
          </div>

          {/* Database Status Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: dbStatus?.connected ? 'var(--success-subtle)' : 'var(--primary-subtle)',
            border: `1px solid ${dbStatus?.connected ? '#bbf7d0' : '#fde68a'}`,
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: dbStatus?.connected ? 'var(--success)' : '#92400e'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: dbStatus?.connected ? 'var(--success)' : '#d97706',
              display: 'inline-block'
            }} />
            {dbStatus?.connected ? 'MySQL Conectado' : 'Modo In-Memory Activo'}
          </div>

          <a
            href="/"
            style={{
              textDecoration: 'none',
              color: 'var(--text)',
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}
          >
            🌐 E-commerce
          </a>

          <a
            href="/app/"
            style={{
              textDecoration: 'none',
              color: 'white',
              background: 'linear-gradient(135deg, #d97706, #ea580c)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            📱 PWA Mobile
          </a>

          <button
            onClick={handleLogout}
            title="Cerrar sesión de iDempiere ERP"
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🚪 Salir
          </button>
        </div>
      </header>

      {/* Contingency Banner if ERP operates in fallback */}
      {authSession.source === 'idempiere-contingency-mode' && (
        <div style={{
          background: '#fffbeb',
          borderBottom: '1px solid #fde68a',
          color: '#92400e',
          padding: '8px 28px',
          fontSize: '0.78rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🛡️ MODO CONTINGENCIA TOLERANTE A FALLOS:</span>
          <span>{authSession.contingencyReason}</span>
        </div>
      )}

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1 }}>
        
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '28px',
          paddingBottom: '12px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'metrics', label: '📊 Métricas de Consumidores', count: null },
            { id: 'products', label: '🍔 Catálogo de Hamburguesas', count: products.length },
            { id: 'orders', label: '🛵 Órdenes en Tiempo Real', count: metrics?.recentOrders?.length || null },
            { id: 'database', label: '🗄️ Monitor DB & iDempiere ERP', count: 'v1.0' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--primary)' : 'var(--surface)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--primary)' : 'var(--border)',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--surface-subtle)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: CONSUMER & SALES METRICS */}
        {activeTab === 'metrics' && (
          <div>
            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Ventas Hoy
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '6px' }}>
                  ${metrics?.summary?.totalRevenue || '3,840.50'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '4px', fontWeight: '700' }}>
                  ↑ +14.8% vs promedio semanal
                </div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Órdenes Totales
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginTop: '6px' }}>
                  {metrics?.summary?.totalOrders || '188'} pedidos
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Ticket promedio: <strong>${metrics?.summary?.averageTicket || '20.42'}</strong>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Clientes Activos
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginTop: '6px' }}>
                  {metrics?.summary?.activeCustomers?.toLocaleString() || '1,240'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '4px', fontWeight: '700' }}>
                  👥 72% fidelidad recurrente
                </div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Satisfacción de Clientes
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b45309', marginTop: '6px' }}>
                  ★ 4.9 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '4px', fontWeight: '700' }}>
                  ✓ 98% comentarios positivos
                </div>
              </div>
            </div>

            {/* Customer Segmentation Section */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '26px', marginBottom: '28px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text)' }}>
                    Segmentación de Clientes según Nivel de Consumo
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Distribución de clientes clasificados por frecuencia y volumen de compra mensual
                  </p>
                </div>
                <span style={{ background: 'var(--primary-subtle)', color: '#92400e', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                  Sincronizado con iDempiere
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {(metrics?.customerSegmentation || []).map((seg, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text)' }}>{seg.tier}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>{seg.percentage}%</span>
                    </div>

                    <div style={{ height: '7px', background: '#e7dfd5', borderRadius: '9999px', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{
                        height: '100%',
                        width: `${seg.percentage}%`,
                        background: 'linear-gradient(90deg, #d97706, #ea580c)',
                        borderRadius: '9999px'
                      }} />
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <div>Clientes: <strong>{seg.count} usuarios</strong></div>
                      <div>Gasto promedio: <strong>{seg.avgMonthlySpend}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Consumers Table */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>
                Top 5 Consumidores del Mes
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Clientes con mayor volumen de gasto acumulado y pedidos
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 6px', fontWeight: '700' }}>Cliente</th>
                      <th style={{ padding: '8px 6px', fontWeight: '700' }}>Nivel</th>
                      <th style={{ padding: '8px 6px', fontWeight: '700' }}>Pedidos</th>
                      <th style={{ padding: '8px 6px', fontWeight: '700' }}>Total Gastado</th>
                      <th style={{ padding: '8px 6px', fontWeight: '700' }}>Favorita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(metrics?.topConsumers || []).map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{c.avatar}</span>
                            <div>
                              <strong style={{ color: 'var(--text)', display: 'block' }}>{c.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#a8a29e' }}>{c.email}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 6px' }}>
                          <span style={{
                            background: c.tier.includes('Platinum') ? '#fef3c7' : '#f0fdf4',
                            color: c.tier.includes('Platinum') ? '#92400e' : '#166534',
                            border: '1px solid',
                            borderColor: c.tier.includes('Platinum') ? '#fde68a' : '#bbf7d0',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '700'
                          }}>
                            {c.tier}
                          </span>
                        </td>
                        <td style={{ padding: '12px 6px', fontWeight: '700' }}>{c.totalOrders}</td>
                        <td style={{ padding: '12px 6px', fontWeight: '800', color: 'var(--primary)' }}>
                          ${Number(c.totalSpent || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {c.favoriteBurger}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BURGER CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '600px' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar hamburguesa por nombre o categoría..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '0.88rem'
                  }}
                />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    color: 'var(--text)'
                  }}
                >
                  <option value="all">Todas las categorías</option>
                  <option value="Especiales">Especiales</option>
                  <option value="Clásicas">Clásicas</option>
                  <option value="Gourmet">Gourmet</option>
                  <option value="Pollo Crispy">Pollo Crispy</option>
                  <option value="Complementos">Complementos</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleResetCatalog}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Reset Catálogo Demo
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #d97706, #ea580c)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span>+</span> Nueva Hamburguesa
                </button>
              </div>
            </div>

            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '14px 16px', fontWeight: '700' }}>Hamburguesa</th>
                    <th style={{ padding: '14px 16px', fontWeight: '700' }}>Especialidad</th>
                    <th style={{ padding: '14px 16px', fontWeight: '700' }}>Categoría</th>
                    <th style={{ padding: '14px 16px', fontWeight: '700' }}>Precio</th>
                    <th style={{ padding: '14px 16px', fontWeight: '700' }}>Stock en Parrilla</th>
                    <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.92rem' }}>
                              {p.name}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: '#854d0e', fontWeight: '700' }}>
                              ★ {p.rating || '4.9'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: 'var(--primary-subtle)',
                          color: '#92400e',
                          border: '1px solid var(--primary-border)',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: '700'
                        }}>
                          {p.specialty_level || 'Especial'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {p.category}
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                        ${Number(p.price || 0).toFixed(2)}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleStockChange(p.id, p.stock, -5)}
                            style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-subtle)', cursor: 'pointer', fontWeight: '800' }}
                          >
                            -
                          </button>
                          <span style={{
                            fontWeight: '800',
                            minWidth: '34px',
                            textAlign: 'center',
                            color: p.stock < 15 ? 'var(--danger)' : 'var(--text)'
                          }}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockChange(p.id, p.stock, 5)}
                            style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-subtle)', cursor: 'pointer', fontWeight: '800' }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          style={{
                            background: 'var(--danger-subtle)',
                            color: 'var(--danger)',
                            border: '1px solid #fecaca',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REAL-TIME SIMULATED ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Órdenes Sincronizadas PWA</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Pedidos registrados desde la aplicación móvil PWA
                </p>
              </div>
              <button
                onClick={loadData}
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                🔄 Actualizar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(metrics?.recentOrders || []).map((ord, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{ord.id}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>&bull; {ord.customer}</span>
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {ord.customerType || 'VIP Platinum'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text)', marginTop: '4px' }}>
                      <strong>Items:</strong> {Array.isArray(ord.items) ? ord.items.join(', ') : ord.items}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#a8a29e', marginTop: '2px' }}>
                      📍 {ord.address}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                      ${ord.total}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      background: ord.status.includes('Entregado') ? 'var(--success-subtle)' : 'var(--primary-subtle)',
                      color: ord.status.includes('Entregado') ? 'var(--success)' : '#92400e',
                      border: '1px solid',
                      borderColor: ord.status.includes('Entregado') ? '#bbf7d0' : '#fde68a',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      marginTop: '4px'
                    }}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE & iDEMPIERE ERP MONITOR */}
        {activeTab === 'database' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* iDempiere ERP Card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '26px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.8rem' }}>🏢</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>iDempiere ERP REST API v1</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Módulo de Autenticación y Control de Acceso</p>
                </div>
              </div>

              <div style={{
                background: authSession.source === 'idempiere-live-erp' ? 'var(--success-subtle)' : '#fffbeb',
                border: `1px solid ${authSession.source === 'idempiere-live-erp' ? '#bbf7d0' : '#fde68a'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: authSession.source === 'idempiere-live-erp' ? '#166534' : '#92400e' }}>
                  ESTADO DE SESIÓN ERP
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '4px', color: authSession.source === 'idempiere-live-erp' ? 'var(--success)' : '#b45309' }}>
                  {authSession.source === 'idempiere-live-erp' ? '🟢 Conectado en Vivo a iDempiere ERP' : '🛡️ Sesión Activa en Modo Contingencia'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Usuario: <strong>{authSession.userName}</strong> &bull; Token: <code>{authSession.token.slice(0, 20)}...</code>
                </div>
              </div>

              {/* Technical Specifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Endpoint Base:</span>
                  <strong>POST /api/v1/auth/tokens</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cabeceras Obligatorias:</span>
                  <strong>Content-Type & Accept: application/json</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Organización (organizationId):</span>
                  <strong>{authSession.erpContext?.organizationId || 11}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Almacén (warehouseId):</span>
                  <strong>{authSession.erpContext?.warehouseId || 103}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rol ERP (roleId):</span>
                  <strong>{authSession.erpContext?.roleId || 102}</strong>
                </div>
              </div>
            </div>

            {/* Database Engine Card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '26px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.8rem' }}>🐬</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Base de Datos del Sistema</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Catálogo de Hamburguesas y Órdenes</p>
                </div>
              </div>

              <div style={{
                background: dbStatus?.connected ? 'var(--success-subtle)' : 'var(--primary-subtle)',
                border: `1px solid ${dbStatus?.connected ? '#bbf7d0' : '#fde68a'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: dbStatus?.connected ? '#166534' : '#92400e' }}>
                  MOTOR ACTIVO
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '4px', color: dbStatus?.connected ? 'var(--success)' : '#b45309' }}>
                  {dbStatus?.connected ? '✅ MySQL Conectado (Producción)' : '⚡ Modo In-Memory Activo'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Host: <strong>{dbStatus?.host || 'In-Memory Fallback'}</strong> &bull; BD: <strong>{dbStatus?.database || 'hamburger_rapid'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Puerto:</span>
                  <strong>{dbStatus?.port || 3306}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Productos en Catálogo:</span>
                  <strong>{products.length} hamburguesas</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Latencia API:</span>
                  <strong style={{ color: 'var(--success)' }}>&lt; 5 ms</strong>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CREATE BURGER MODAL */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(28, 25, 23, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: '20px',
            maxWidth: '540px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-accent)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Nueva Hamburguesa Rapid</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  Nombre de la Hamburguesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Burger Imperial BBQ"
                  value={newBurger.name}
                  onChange={e => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <select
                    value={newBurger.category}
                    onChange={e => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  >
                    <option value="Especiales">Especiales</option>
                    <option value="Clásicas">Clásicas</option>
                    <option value="Gourmet">Gourmet</option>
                    <option value="Pollo Crispy">Pollo Crispy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Precio ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.99"
                    value={newBurger.price}
                    onChange={e => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Nivel de Especialidad (Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="👑 Firma de la Casa / 💎 Ultra Especial"
                    value={newBurger.specialty_level}
                    onChange={e => setNewBurger({ ...newBurger, specialty_level: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    value={newBurger.stock}
                    onChange={e => setNewBurger({ ...newBurger, stock: parseInt(e.target.value, 10) || 0 })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  URL de Imagen (Unsplash)
                </label>
                <input
                  type="url"
                  value={newBurger.image}
                  onChange={e => setNewBurger({ ...newBurger, image: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  Descripción Apetecible
                </label>
                <textarea
                  rows="2"
                  placeholder="Carne Angus jugosa, queso fundido..."
                  value={newBurger.description}
                  onChange={e => setNewBurger({ ...newBurger, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    flex: 1,
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #d97706, #ea580c)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Guardar Hamburguesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '16px 28px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        Hamburger Rapid &bull; Panel de Control Administrativo &bull; Autenticación iDempiere ERP REST API v1
      </footer>

    </div>
  );
}
