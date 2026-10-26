import React, { useState, useEffect } from 'react';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    price: 15.99,
    specialty_level: '👑 Firma de la Casa',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: 'Triple carne Angus certificada flameada a la leña de roble, queso cheddar añejo fundido, cebolla al bourbon y bacon crocante.',
    ingredients: 'Triple carne Angus 250g, Cheddar 12m, Bacon ahumado, Pan brioche.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    price: 10.99,
    specialty_level: '⭐ Clásica Destacada',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón jugoso a la parrilla, queso derretido, lechuga romana, tomate fresco, pepinillos y salsa Rapid.',
    ingredients: 'Medallón 180g, Queso americano, Lechuga, Tomate, Pepinillos.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Clásicas',
    price: 13.99,
    specialty_level: '🔥 Doble Corona',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    description: 'Doble smash caramelizado con doble queso cheddar fundido, tocino crocante y cebolla morada encurtida.',
    ingredients: 'Doble medallón 300g, Doble cheddar, Tiras de tocino, Pan de papa.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    price: 14.50,
    specialty_level: '💎 Ultra Especial',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=80',
    description: 'Dos medallones de carne Angus con queso gouda ahumado, champiñones salteados y emulsión de ajo negro.',
    ingredients: '2x Angus 300g, Gouda ahumado, Champiñones al ajillo, Ajo negro.'
  },
  {
    id: 5,
    name: 'Smash Trufa Imperial',
    category: 'Gourmet',
    price: 16.99,
    specialty_level: '🥇 Selección Gourmet',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1583032015879-66170d49f056?w=500&auto=format&fit=crop&q=80',
    description: 'Doble carne madurada Dry Aged, queso brie francés, mayonesa de trufa negra y crujiente de cebolla frita.',
    ingredients: 'Carne madurada 280g, Queso brie, Salsa trufa negra, Crispy onions.'
  },
  {
    id: 6,
    name: 'Crispy Smokehouse Chicken',
    category: 'Pollo Crispy',
    price: 11.99,
    specialty_level: '🍗 Crujiente Maestro',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h, empanizado crujiente de 11 especias, ensalada coleslaw de manzana verde y miel de chipotle.',
    ingredients: 'Pechuga pollo crispy 220g, Coleslaw, Miel chipotle, Pepinillos.'
  },
  {
    id: 7,
    name: 'Bacon BBQ Supreme',
    category: 'Especiales',
    price: 13.50,
    specialty_level: '🥓 Favorita Ahumada',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=80',
    description: 'Carne Angus envuelta en tocino glaseado en salsa BBQ artesanal al whisky, aros de cebolla y queso Monterrey.',
    ingredients: 'Carne Angus 200g, Tocino BBQ whisky, Monterrey Jack, Aros de cebolla.'
  },
  {
    id: 8,
    name: 'Volcán Cheddar Melt',
    category: 'Especiales',
    price: 14.99,
    specialty_level: '🧀 Explosión de Queso',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón grueso bañado en cascada de queso cheddar fundido al momento con trocitos de bacon y jalapeños suaves.',
    ingredients: 'Carne res 220g, Cascada cheddar caliente, Bacon bits, Jalapeños.'
  },
  {
    id: 9,
    name: 'Veggie Portobello Gourmet',
    category: 'Gourmet',
    price: 12.50,
    specialty_level: '🌱 100% Plant & Earth',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=80',
    description: 'Portobello gigante a la leña marinado al balsámico, queso de cabra tibio, tomates secos confitados y pesto fresco.',
    ingredients: 'Portobello gigante, Queso de cabra, Tomates confitados, Pesto.'
  },
  {
    id: 10,
    name: 'Triple Fuego Habanero',
    category: 'Especiales',
    price: 15.50,
    specialty_level: '🌶️ Ultra Spicy Fuego',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80',
    description: 'Tres medallones smash sazonados, queso pepper jack ardiente, jalea casera de habanero tostado y guacamole fresco.',
    ingredients: '3x Smash 330g, Pepper jack, Mermelada habanero, Guacamole.'
  },
  {
    id: 11,
    name: 'Papas Rústicas Trufa & Parmesano',
    category: 'Complementos',
    price: 5.50,
    specialty_level: '🍟 Acompañamiento VIP',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
    description: 'Papas agria rústicas con doble fritura, aceite de trufa blanca de alba y parmesano reggiano rallado.',
    ingredients: 'Papas rústicas, Trufa blanca, Queso parmesano, Sal de mar.'
  },
  {
    id: 13,
    name: 'Milkshake Vainilla Bourbon',
    category: 'Bebidas',
    price: 5.99,
    specialty_level: '🥤 Dulce Placer',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
    description: 'Helado de vainilla natural batido con caramelo salado al bourbon y crema chantilly.',
    ingredients: 'Vainilla natural, Caramelo salado, Chantilly montada.'
  }
];

const OFFERS = [
  {
    id: 'off-1',
    title: '🔥 2x1 en Burger Real Clásica',
    badge: 'MARTES BURGER',
    description: 'Paga una y llévate dos de nuestra icónica receta a la parrilla.',
    burgerName: 'Burger Real Clásica',
    dealPrice: 10.99,
    originalPrice: 21.98,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-2',
    title: '🍔 Combo Dúo Real Especial',
    badge: 'COMBO PAREJA',
    description: '2x Burger Doble Especial + Papas Rústicas Trufa + 2 Bebidas artesanales.',
    burgerName: 'Burger Doble Especial (Dúo)',
    dealPrice: 26.90,
    originalPrice: 38.00,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-3',
    title: '👑 Festín del Rey + Milkshake',
    badge: 'COMBO PLATINUM',
    description: '1x Rey de las Burgers con Papas Trufa y Milkshake Vainilla Bourbon.',
    burgerName: 'Combo Rey de las Burgers VIP',
    dealPrice: 21.50,
    originalPrice: 27.48,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'offers' | 'orders' | 'profile'
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [selectedBurgerForModal, setSelectedBurgerForModal] = useState(null);
  const [customDoneness, setCustomDoneness] = useState('A punto (Medio)');
  const [customExtras, setCustomExtras] = useState([]);
  
  // Simulated Orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-7412',
      customer: 'Carlos Rodríguez',
      items: [{ name: 'Rey de las Burgers', qty: 1, price: 15.99 }, { name: 'Papas Rústicas Trufa & Parmesano', qty: 1, price: 5.50 }],
      total: 21.49,
      status: 'En camino',
      step: 3,
      eta: '8 minutos',
      createdAt: 'Hace 14 minutos'
    }
  ]);
  const [orderSuccessModal, setOrderSuccessModal] = useState(null);

  // Connectivity & PWA install
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Listen to network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Install prompt
    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);

    // Fetch live products from backend
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const normalized = data.data.map(p => ({
            ...p,
            price: Number(p.price) || 0,
            stock: parseInt(p.stock, 10) || 0,
            rating: Number(p.rating) || 4.9
          }));
          setProducts(normalized);
        }
      })
      .catch(() => {
        // Fallback already in state
      });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handlePrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar esta PWA: en el menú de tu navegador selecciona "Agregar a la pantalla de inicio" o "Instalar aplicación".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Add item to cart with customizations
  const addToCart = (product, extras = [], doneness = null) => {
    const extraCost = extras.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const unitPrice = (Number(product.price) || 0) + extraCost;
    const cartItemId = `${product.id}-${extras.map(e => e.id).sort().join('-')}-${doneness || 'default'}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        cartItemId,
        id: product.id,
        name: product.name,
        price: unitPrice,
        basePrice: Number(product.price) || 0,
        image: product.image,
        qty: 1,
        extras,
        doneness
      }];
    });

    setSelectedBurgerForModal(null);
    setCustomExtras([]);
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'RAPID25') {
      setDiscountPercent(25);
      setCouponApplied('RAPID25 (-25%)');
    } else if (code === 'RAPIDFREE') {
      setDiscountPercent(15);
      setCouponApplied('RAPIDFREE (Envío + 15% Descuento)');
    } else {
      alert('Cupón no válido. Prueba usando RAPID25 o RAPIDFREE.');
    }
  };

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.qty || 1)), 0);
  const discount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 25 || discountPercent === 15 ? 0 : (subtotal > 0 ? 2.50 : 0);
  const total = Math.max(0, subtotal - discount + shipping);

  // Confirm Simulated Order
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    const orderPayload = {
      customer: 'Carlos Rodríguez',
      customerType: 'VIP Platinum',
      items: cart.map(item => `${item.qty}x ${item.name}`),
      total: total.toFixed(2),
      address: 'Av. Las Palmas 742, Depto 5B',
      createdAt: 'Ahora mismo'
    };

    // Send to backend
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
    } catch (e) {
      console.log('Order simulated locally');
    }

    const newSimOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: 'Carlos Rodríguez',
      items: [...cart],
      total: total.toFixed(2),
      status: 'En parrilla 🔥',
      step: 2,
      eta: '18 minutos',
      createdAt: 'Hace un momento'
    };

    setOrders(prev => [newSimOrder, ...prev]);
    setOrderSuccessModal(newSimOrder);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('orders');
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      
      {/* Top App Bar - Dark Obsidian Hamburgesin UI */}
      <header style={{
        background: 'rgba(12, 12, 14, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 18px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🍔</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text)' }}>Hamburger Rapid</span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: '9999px',
                background: isOnline ? 'var(--success-subtle)' : 'rgba(239, 68, 68, 0.15)',
                color: isOnline ? 'var(--success)' : '#ef4444',
                border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              📍 Entrega en: <strong style={{ color: 'var(--text)' }}>Av. Las Palmas 742</strong>
            </div>
          </div>
        </div>

        {/* Cart Trigger Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'relative',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border-accent)',
            color: 'var(--primary)',
            width: '42px',
            height: '42px',
            borderRadius: '9999px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
          aria-label="Abrir carrito"
        >
          🛒
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '0.72rem',
              fontWeight: '800',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 87, 34, 0.6)'
            }}>
              {cart.reduce((sum, i) => sum + i.qty, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Main Tab Views */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        
        {/* TAB 1: MENÚ */}
        {activeTab === 'menu' && (
          <div className="fade-in">
            {/* Search Input - White Pill Hamburgesin Style */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar hamburguesas, ingredientes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  outline: 'none',
                  color: '#111827',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'Especiales', label: '👑 Especiales' },
                { id: 'Clásicas', label: '⭐ Clásicas' },
                { id: 'Gourmet', label: '🥇 Gourmet' },
                { id: 'Pollo Crispy', label: '🍗 Pollo' },
                { id: 'Complementos', label: '🍟 Acompañamientos' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)',
                    background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--surface)',
                    color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedCategory === cat.id ? '0 4px 14px rgba(255, 87, 34, 0.35)' : 'none'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Burgers Listing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          color: 'var(--primary)',
                          background: 'var(--primary-subtle)',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          border: '1px solid var(--primary-border)'
                        }}>
                          {p.specialty_level}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: '800' }}>
                          ★ {p.rating}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.02rem', fontWeight: '800', marginTop: '4px', color: 'var(--text)', lineHeight: '1.2' }}>
                        {p.name}
                      </h3>
                      <p style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginTop: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {p.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ${Number(p.price || 0).toFixed(2)}
                      </span>

                      <button
                        onClick={() => setSelectedBurgerForModal(p)}
                        style={{
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '7px 16px',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 3px 10px rgba(255, 87, 34, 0.35)',
                          transition: 'all 0.2s'
                        }}
                      >
                        + Personalizar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OFERTAS */}
        {activeTab === 'offers' && (
          <div className="fade-in">
            <div style={{
              background: 'linear-gradient(135deg, #18181c, #261612)',
              border: '1px solid var(--border-accent)',
              borderRadius: '20px',
              padding: '20px',
              color: 'white',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{
                background: 'var(--primary)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                CUPÓN DEL DÍA ●
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '10px 0 4px', color: '#ffffff' }}>25% OFF en tu orden</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Usa el código <strong style={{ color: 'var(--primary)' }}>RAPID25</strong> al finalizar tu compra.
              </p>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text)' }}>
              Combos & Promociones Activas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {OFFERS.map(offer => (
                <div
                  key={offer.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '16px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                    <img
                      src={offer.image}
                      alt={offer.title}
                      style={{ width: '85px', height: '85px', borderRadius: '14px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary-border)',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        padding: '3px 9px',
                        borderRadius: '9999px'
                      }}>
                        {offer.badge}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '6px 0 3px', color: 'var(--text)' }}>
                        {offer.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{offer.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ${Number(offer.dealPrice || 0).toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textDecoration: 'line-through', marginLeft: '8px' }}>
                        ${Number(offer.originalPrice || 0).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart({
                          id: offer.id,
                          name: offer.title,
                          price: offer.dealPrice,
                          image: offer.image
                        });
                        setIsCartOpen(true);
                      }}
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        boxShadow: '0 3px 12px rgba(255, 87, 34, 0.35)',
                        transition: 'all 0.2s'
                      }}
                    >
                      Aprovechar Oferta 🛒
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ÓRDENES */}
        {activeTab === 'orders' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text)' }}>
              Seguimiento de Órdenes
            </h3>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '3rem' }}>🛵</span>
                <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>No tienes órdenes activas en este momento.</p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '11px 22px',
                    borderRadius: '9999px',
                    fontWeight: '800',
                    marginTop: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 87, 34, 0.4)'
                  }}
                >
                  Explorar Menú
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order, idx) => (
                  <div
                    key={order.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text)' }}>{order.id}</span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.createdAt}</div>
                      </div>
                      <span style={{
                        background: order.status.includes('Entregado') ? 'var(--success-subtle)' : 'var(--primary-subtle)',
                        color: order.status.includes('Entregado') ? 'var(--success)' : 'var(--primary)',
                        border: '1px solid',
                        borderColor: order.status.includes('Entregado') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 87, 34, 0.4)',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: '800'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    {/* Stepper Progress Visual */}
                    <div style={{
                      background: 'var(--surface-subtle)',
                      padding: '14px',
                      borderRadius: '16px',
                      marginBottom: '14px',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '700', marginBottom: '8px' }}>
                        <span style={{ color: order.step >= 1 ? 'var(--primary)' : 'var(--text-dim)' }}>1. Recibida</span>
                        <span style={{ color: order.step >= 2 ? 'var(--primary)' : 'var(--text-dim)' }}>2. Parrilla</span>
                        <span style={{ color: order.step >= 3 ? 'var(--primary)' : 'var(--text-dim)' }}>3. En Camino</span>
                        <span style={{ color: order.step >= 4 ? 'var(--success)' : 'var(--text-dim)' }}>4. Entregada</span>
                      </div>
                      {/* Bar */}
                      <div style={{ height: '7px', background: '#22222a', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(order.step / 4) * 100}%`,
                          background: 'linear-gradient(90deg, #ff5722, #ff784e)',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                        ⏱️ Tiempo restante estimado: <strong style={{ color: 'var(--text)' }}>{order.eta || '15 min'}</strong>
                      </div>
                    </div>

                    {/* Items list */}
                    <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '10px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>PRODUCTOS</div>
                      {order.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text)' }}>
                          <span>{typeof it === 'string' ? it : `${it.qty}x ${it.name}`}</span>
                          <span style={{ fontWeight: '700' }}>{it.price ? `$${(Number(it.price || 0) * (it.qty || 1)).toFixed(2)}` : ''}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Repeat */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total pagado:</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                          ${order.total}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          alert(`Reordenando ${order.id}. Los productos han sido enviados a tu carrito.`);
                          setActiveTab('menu');
                        }}
                        style={{
                          background: 'var(--surface-subtle)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        🔄 Repetir Pedido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PERFIL */}
        {activeTab === 'profile' && (
          <div className="fade-in">
            {/* User Profile Card */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '22px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '18px'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'var(--surface-subtle)',
                border: '2px solid var(--primary)',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                boxShadow: '0 0 20px rgba(255, 87, 34, 0.25)'
              }}>
                👨🏽
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)' }}>Carlos Rodríguez</h2>
              <div style={{
                display: 'inline-block',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '800',
                margin: '8px 0 16px'
              }}>
                👑 Cliente VIP Platinum
              </div>

              {/* RapidCoins Balance */}
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>RAPIDCOINS</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>450 pts</div>
                </div>
                <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>VALOR EN SALDO</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--success)' }}>$4.50 USD</div>
                </div>
              </div>
            </div>

            {/* Account Settings Menu */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '18px'
            }}>
              {[
                { icon: '📍', label: 'Direcciones Guardadas', sub: 'Casa, Oficina (2 activas)' },
                { icon: '💳', label: 'Métodos de Pago', sub: 'Visa terminada en 4821' },
                { icon: '🔔', label: 'Notificaciones de Pedidos', sub: 'Push activadas' },
                { icon: '🎁', label: 'Invitar Amigos', sub: 'Gana $5 por cada recomendado' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '15px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: idx < 3 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>{item.label}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>&rsaquo;</span>
                </div>
              ))}
            </div>

            {/* PWA & System Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '9999px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(255, 87, 34, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                📲 Instalar App en Pantalla de Inicio
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                <a
                  href="/"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    padding: '12px',
                    borderRadius: '9999px',
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    fontWeight: '700'
                  }}
                >
                  🌐 Ir a E-commerce
                </a>
                <a
                  href="/admin"
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    padding: '12px',
                    borderRadius: '9999px',
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    fontWeight: '700'
                  }}
                >
                  ⚙️ Panel Admin
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CUSTOMIZE BURGER MODAL */}
      {selectedBurgerForModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="slide-up" style={{
            background: 'var(--surface)',
            width: '100%',
            maxWidth: '480px',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            borderTop: '1px solid var(--border)',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '24px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>Personaliza tu Hamburguesa</h3>
              <button
                onClick={() => setSelectedBurgerForModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
              <img
                src={selectedBurgerForModal.image}
                alt={selectedBurgerForModal.name}
                style={{ width: '85px', height: '85px', borderRadius: '14px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text)' }}>{selectedBurgerForModal.name}</h4>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                  ${Number(selectedBurgerForModal.price || 0).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selectedBurgerForModal.ingredients}
                </div>
              </div>
            </div>

            {/* Cooking point */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                PUNTO DE COCCIÓN DE LA CARNE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['Término Medio (Jugoso)', 'A punto (Recomendado)', 'Bien Cocido'].map(done => (
                  <button
                    key={done}
                    onClick={() => setCustomDoneness(done)}
                    style={{
                      padding: '9px 6px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid',
                      borderColor: customDoneness === done ? 'var(--primary)' : 'var(--border)',
                      background: customDoneness === done ? 'var(--primary)' : 'var(--surface-subtle)',
                      color: customDoneness === done ? '#ffffff' : 'var(--text)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {done}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras Selection */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                EXTRAS Y TOPPINGS GOURMET
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'ex-1', label: 'Queso Cheddar Añejo Fundido Extra', price: 1.50 },
                  { id: 'ex-2', label: 'Doble Tira de Bacon Ahumado', price: 2.00 },
                  { id: 'ex-3', label: 'Huevo de Campo a la Plancha', price: 1.20 },
                  { id: 'ex-4', label: 'Dip de Mayonesa de Trufa Negra', price: 1.00 }
                ].map(extra => {
                  const isChecked = customExtras.some(e => e.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => {
                        if (isChecked) {
                          setCustomExtras(prev => prev.filter(e => e.id !== extra.id));
                        } else {
                          setCustomExtras(prev => [...prev, extra]);
                        }
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        background: isChecked ? 'var(--primary-subtle)' : 'var(--surface-subtle)',
                        border: '1px solid',
                        borderColor: isChecked ? 'var(--primary-border)' : 'var(--border)',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.84rem', fontWeight: '600' }}>
                        {isChecked ? '✅ ' : '⬜ '} {extra.label}
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary)' }}>
                        +${Number(extra.price || 0).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Add to Cart Button */}
            <button
              onClick={() => addToCart(selectedBurgerForModal, customExtras, customDoneness)}
              style={{
                width: '100%',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255, 87, 34, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              Agregar al Carrito &bull; ${(
                Number(selectedBurgerForModal.price || 0) +
                customExtras.reduce((s, e) => s + (Number(e.price) || 0), 0)
              ).toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* CART & CHECKOUT DRAWER */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="slide-up" style={{
            background: 'var(--surface)',
            width: '100%',
            maxWidth: '480px',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            borderTop: '1px solid var(--border)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🛒</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>Tu Carrito Rapid</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🛍️</span>
                  <p style={{ marginTop: '8px' }}>Tu carrito está vacío.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map(item => (
                    <div
                      key={item.cartItemId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'var(--surface-subtle)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>{item.name}</div>
                          {item.extras && item.extras.length > 0 && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>
                              +{item.extras.map(e => e.label.split(' ')[0]).join(', ')}
                            </div>
                          )}
                          <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary)' }}>
                            ${(Number(item.price || 0) * item.qty).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid var(--border)',
                            background: 'var(--surface-elevated)',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            fontWeight: '800'
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text)', minWidth: '18px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid var(--border)',
                            background: 'var(--surface-elevated)',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            fontWeight: '800'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon Code Section */}
            {cart.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Cupón (ej. RAPID25)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-subtle)',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={applyCoupon}
                  style={{
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Aplicar
                </button>
              </div>
            )}

            {couponApplied && (
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700', marginBottom: '8px' }}>
                ✓ {couponApplied}
              </div>
            )}

            {/* Pricing Summary */}
            {cart.length > 0 && (
              <div style={{
                background: 'var(--surface-subtle)',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '16px',
                border: '1px solid var(--border)',
                fontSize: '0.84rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text)' }}>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--success)', fontWeight: '700' }}>
                    <span>Descuento aplicado</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Envío Express</span>
                  <span style={{ color: 'var(--text)' }}>{shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px', fontSize: '1.1rem', fontWeight: '800' }}>
                  <span style={{ color: 'var(--text)' }}>Total a pagar</span>
                  <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            {cart.length > 0 && (
              <button
                onClick={handleConfirmOrder}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '9999px',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 87, 34, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>🔥</span> Confirmar y Simular Pedido (${total.toFixed(2)})
              </button>
            )}
          </div>
        </div>
      )}

      {/* SIMULATED ORDER SUCCESS MODAL */}
      {orderSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="fade-in" style={{
            background: 'var(--surface)',
            borderRadius: '24px',
            padding: '28px 24px',
            maxWidth: '380px',
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-accent)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text)' }}>¡Pedido Confirmado!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              Tu orden <strong style={{ color: 'var(--text)' }}>{orderSuccessModal.id}</strong> ha entrado a la parrilla de leña. El repartidor llegará en aprox. <strong style={{ color: 'var(--primary)' }}>18 minutos</strong>.
            </p>
            <div style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: '16px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text)' }}>Total pagado: ${orderSuccessModal.total}</strong><br/>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 Av. Las Palmas 742</span>
            </div>
            <button
              onClick={() => setOrderSuccessModal(null)}
              style={{
                width: '100%',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '9999px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 87, 34, 0.4)'
              }}
            >
              Ver Estado en Vivo 🛵
            </button>
          </div>
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR - Dark Hamburgesin UI */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(14, 14, 18, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '10px 6px',
        zIndex: 40,
        boxShadow: '0 -6px 25px rgba(0,0,0,0.5)'
      }}>
        {[
          { id: 'menu', label: 'Menú', icon: '🍔' },
          { id: 'offers', label: 'Ofertas', icon: '🏷️' },
          { id: 'orders', label: 'Órdenes', icon: '🛵', badge: orders.length > 0 ? orders.length : null },
          { id: 'profile', label: 'Perfil', icon: '👤' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative',
              transition: 'color 0.2s'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: activeTab === tab.id ? '800' : '600'
            }}>
              {tab.label}
            </span>
            {tab.badge && (
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '22px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(255, 87, 34, 0.5)'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

    </div>
  );
}
