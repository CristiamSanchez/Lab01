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
          setProducts(data.data);
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
    const extraCost = extras.reduce((sum, item) => sum + item.price, 0);
    const unitPrice = product.price + extraCost;
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
        basePrice: product.price,
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
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
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
      
      {/* Top App Bar */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 18px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🍔</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text)' }}>Hamburger Rapid</span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '6px',
                background: isOnline ? 'var(--success-subtle)' : '#fef2f2',
                color: isOnline ? 'var(--success)' : '#ef4444'
              }}>
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              📍 Entrega en: <strong>Av. Las Palmas 742</strong>
            </div>
          </div>
        </div>

        {/* Cart Trigger Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'relative',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-border)',
            color: '#92400e',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
          aria-label="Abrir carrito"
        >
          🛒
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: 'var(--flame)',
              color: 'white',
              fontSize: '0.72rem',
              fontWeight: '800',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.4)'
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
            {/* Search Input */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar hamburguesas, ingredientes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: 'var(--text)',
                  boxShadow: 'var(--shadow-sm)'
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
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)',
                    background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--surface)',
                    color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
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
                    borderRadius: '16px',
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
                      borderRadius: '12px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          color: '#92400e',
                          background: 'var(--primary-subtle)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #fde68a'
                        }}>
                          {p.specialty_level}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: '700' }}>
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
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ${p.price.toFixed(2)}
                      </span>

                      <button
                        onClick={() => setSelectedBurgerForModal(p)}
                        style={{
                          background: 'linear-gradient(135deg, #d97706, #ea580c)',
                          color: 'white',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)'
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
              background: 'linear-gradient(135deg, #ea580c, #d97706)',
              borderRadius: '16px',
              padding: '18px',
              color: 'white',
              marginBottom: '18px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                CUPÓN DEL DÍA
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '8px 0 4px' }}>25% OFF en tu orden</h2>
              <p style={{ fontSize: '0.82rem', opacity: 0.9 }}>Usa el código <strong>RAPID25</strong> al finalizar tu compra.</p>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '12px' }}>Combos & Promociones Activas</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {OFFERS.map(offer => (
                <div
                  key={offer.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '14px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <img
                      src={offer.image}
                      alt={offer.title}
                      style={{ width: '85px', height: '85px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{
                        background: 'var(--primary-subtle)',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {offer.badge}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: '4px 0 2px' }}>{offer.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{offer.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ${offer.dealPrice.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#a8a29e', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ${offer.originalPrice.toFixed(2)}
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
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        cursor: 'pointer'
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '14px' }}>Seguimiento de Órdenes</h3>

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
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    marginTop: '14px',
                    cursor: 'pointer'
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
                      borderRadius: '18px',
                      padding: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>{order.id}</span>
                        <div style={{ fontSize: '0.72rem', color: '#a8a29e' }}>{order.createdAt}</div>
                      </div>
                      <span style={{
                        background: order.status.includes('Entregado') ? 'var(--success-subtle)' : 'var(--primary-subtle)',
                        color: order.status.includes('Entregado') ? 'var(--success)' : '#92400e',
                        border: '1px solid',
                        borderColor: order.status.includes('Entregado') ? '#bbf7d0' : '#fde68a',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: '700'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    {/* Stepper Progress Visual */}
                    <div style={{
                      background: 'var(--surface-subtle)',
                      padding: '12px',
                      borderRadius: '12px',
                      marginBottom: '14px',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '700', marginBottom: '6px' }}>
                        <span style={{ color: order.step >= 1 ? 'var(--primary)' : '#a8a29e' }}>1. Recibida</span>
                        <span style={{ color: order.step >= 2 ? 'var(--primary)' : '#a8a29e' }}>2. Parrilla</span>
                        <span style={{ color: order.step >= 3 ? 'var(--primary)' : '#a8a29e' }}>3. En Camino</span>
                        <span style={{ color: order.step >= 4 ? 'var(--success)' : '#a8a29e' }}>4. Entregada</span>
                      </div>
                      {/* Bar */}
                      <div style={{ height: '6px', background: '#e7dfd5', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(order.step / 4) * 100}%`,
                          background: 'linear-gradient(90deg, #d97706, #ea580c)',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
                        ⏱️ Tiempo restante estimado: <strong>{order.eta || '15 min'}</strong>
                      </div>
                    </div>

                    {/* Items list */}
                    <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '10px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#a8a29e', marginBottom: '4px' }}>PRODUCTOS</div>
                      {order.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '3px' }}>
                          <span>{typeof it === 'string' ? it : `${it.qty}x ${it.name}`}</span>
                          <span style={{ fontWeight: '600' }}>{it.price ? `$${(it.price * (it.qty || 1)).toFixed(2)}` : ''}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Repeat */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total pagado:</span>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
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
                          padding: '7px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer'
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
              borderRadius: '20px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '18px'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                border: '2px solid var(--primary-border)',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem'
              }}>
                👨🏽
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Carlos Rodríguez</h2>
              <div style={{
                display: 'inline-block',
                background: 'var(--primary-subtle)',
                color: '#92400e',
                border: '1px solid #fde68a',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                margin: '6px 0 14px'
              }}>
                👑 Cliente VIP Platinum
              </div>

              {/* RapidCoins Balance */}
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>RAPIDCOINS</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>450 pts</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>VALOR EN SALDO</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--success)' }}>$4.50 USD</div>
                </div>
              </div>
            </div>

            {/* Account Settings Menu */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
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
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: idx < 3 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{item.label}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                  </div>
                  <span style={{ color: '#a8a29e' }}>&rsaquo;</span>
                </div>
              ))}
            </div>

            {/* PWA & System Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #ea580c)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-md)'
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
                    borderRadius: '10px',
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
                    borderRadius: '10px',
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
          background: 'rgba(28, 25, 23, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="slide-up" style={{
            background: 'var(--surface)',
            width: '100%',
            maxWidth: '480px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Personaliza tu Hamburguesa</h3>
              <button
                onClick={() => setSelectedBurgerForModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <img
                src={selectedBurgerForModal.image}
                alt={selectedBurgerForModal.name}
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{selectedBurgerForModal.name}</h4>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                  ${selectedBurgerForModal.price.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selectedBurgerForModal.ingredients}
                </div>
              </div>
            </div>

            {/* Cooking point */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '8px' }}>
                PUNTO DE COCCIÓN DE LA CARNE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['Término Medio (Jugoso)', 'A punto (Recomendado)', 'Bien Cocido'].map(done => (
                  <button
                    key={done}
                    onClick={() => setCustomDoneness(done)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid',
                      borderColor: customDoneness === done ? 'var(--primary)' : 'var(--border)',
                      background: customDoneness === done ? 'var(--primary-subtle)' : 'var(--surface-subtle)',
                      color: customDoneness === done ? '#92400e' : 'var(--text)',
                      cursor: 'pointer'
                    }}
                  >
                    {done}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras Selection */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#a8a29e', marginBottom: '8px' }}>
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
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: isChecked ? 'var(--primary-subtle)' : 'var(--surface-subtle)',
                        border: '1px solid',
                        borderColor: isChecked ? 'var(--primary-border)' : 'var(--border)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>
                        {isChecked ? '✅ ' : '⬜ '} {extra.label}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                        +${extra.price.toFixed(2)}
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
                background: 'linear-gradient(135deg, #d97706, #ea580c)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              Agregar al Carrito &bull; ${(
                selectedBurgerForModal.price +
                customExtras.reduce((s, e) => s + e.price, 0)
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
          background: 'rgba(28, 25, 23, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="slide-up" style={{
            background: 'var(--surface)',
            width: '100%',
            maxWidth: '480px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🛒</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Tu Carrito Rapid</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '14px' }}>
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
                        padding: '10px',
                        background: 'var(--surface-subtle)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{item.name}</div>
                          {item.extras && item.extras.length > 0 && (
                            <div style={{ fontSize: '0.7rem', color: '#92400e' }}>
                              +{item.extras.map(e => e.label.split(' ')[0]).join(', ')}
                            </div>
                          )}
                          <div style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--primary)' }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'white',
                            cursor: 'pointer',
                            fontWeight: '800'
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'white',
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
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  onClick={applyCoupon}
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
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '14px',
                border: '1px solid var(--border)',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--success)', fontWeight: '700' }}>
                    <span>Descuento aplicado</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Envío Express</span>
                  <span>{shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '6px', fontSize: '1.05rem', fontWeight: '800' }}>
                  <span>Total a pagar</span>
                  <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            {cart.length > 0 && (
              <button
                onClick={handleConfirmOrder}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #ea580c)',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
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
          background: 'rgba(28, 25, 23, 0.75)',
          backdropFilter: 'blur(8px)',
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>¡Pedido Confirmado!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              Tu orden <strong>{orderSuccessModal.id}</strong> ha entrado a la parrilla de leña. El repartidor llegará en aprox. <strong>18 minutos</strong>.
            </p>
            <div style={{ background: 'var(--surface-subtle)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <strong>Total pagado: ${orderSuccessModal.total}</strong><br/>
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
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Ver Estado en Vivo 🛵
            </button>
          </div>
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '10px 6px',
        zIndex: 40,
        boxShadow: '0 -4px 15px rgba(0,0,0,0.04)'
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
              position: 'relative'
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
                background: 'var(--flame)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '800',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
