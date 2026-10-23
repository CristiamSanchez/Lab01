const express = require('express');
const router = express.Router();
const db = require('../db');

// In-memory simulated orders & customer registry to sync PWA and Admin
let simulatedOrders = [
  {
    id: 'ORD-9821',
    customer: 'Carlos Rodríguez',
    customerType: 'VIP Platinum',
    items: ['Rey de las Burgers', 'Papas Rústicas Trufa & Parmesano', 'Rapid Artesanal IPA 473ml'],
    total: 25.99,
    status: 'En camino',
    address: 'Av. Las Palmas 742, Depto 5B',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString()
  },
  {
    id: 'ORD-9820',
    customer: 'Valentina Ríos',
    customerType: 'Frecuente Gold',
    items: ['Burger Real Doble', 'Milkshake Vainilla Bourbon & Caramelo'],
    total: 19.98,
    status: 'En parrilla',
    address: 'Calle Mayor 140, Torre 2',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 'ORD-9819',
    customer: 'Fernando Morales',
    customerType: 'VIP Platinum',
    items: ['Burger Doble Especial', 'Aros de Cebolla Beer-Battered'],
    total: 19.40,
    status: 'Entregado',
    address: 'Urb. El Rosal, Casa #12',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString()
  },
  {
    id: 'ORD-9818',
    customer: 'Sofía Valenzuela',
    customerType: 'Gourmet Gold',
    items: ['Smash Trufa Imperial', 'Rapid Artesanal IPA 473ml'],
    total: 21.49,
    status: 'Entregado',
    address: 'Paseo de la Marina 88',
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString()
  }
];

// Health Check Endpoint (For Dokploy Health Checks)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Hamburger Rapid Commercial v1.0',
    brand: 'Hamburger Rapid',
    database: dbStatus
  });
});

// List products
router.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new product
router.post('/products', async (req, res) => {
  try {
    const { name, category, price, stock, specialty_level, rating, image, description, ingredients } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos.' });
    }
    const product = await db.addProduct({ name, category, price, stock, specialty_level, rating, image, description, ingredients });
    res.status(201).json({ success: true, message: 'Hamburguesa creada exitosamente', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product stock
router.patch('/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ success: false, error: 'El parámetro stock es requerido.' });
    }
    const updated = await db.updateProductStock(id, stock);
    res.json({ success: updated, message: `Stock actualizado a ${stock} para el producto #${id}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);
    res.json({ success: true, message: `Hamburguesa #${id} eliminada.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset initial products
router.post('/reset', async (req, res) => {
  try {
    await db.resetProducts();
    res.json({ success: true, message: 'Catálogo de Hamburger Rapid restablecido a valores por defecto.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Consumer & Sales Metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const products = await db.getProducts();
    const dbStatus = db.getDbStatus();

    // Calculate dynamic stats
    const totalOrdersCount = simulatedOrders.length + 184; // Initial base + live
    const totalRevenueCalc = 3840.50 + simulatedOrders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);

    const metricsData = {
      summary: {
        totalRevenue: totalRevenueCalc.toFixed(2),
        totalOrders: totalOrdersCount,
        averageTicket: (totalRevenueCalc / totalOrdersCount).toFixed(2),
        activeCustomers: 1240,
        customerSatisfaction: '4.9 / 5.0 (98% satisfechos)'
      },
      customerSegmentation: [
        { tier: 'VIP Platinum Gourmet', percentage: 26, count: 322, avgMonthlySpend: '$120 - $240', description: 'Clientes de alta fidelidad (> 4 compras/mes)' },
        { tier: 'Frecuentes Gold', percentage: 44, count: 545, avgMonthlySpend: '$60 - $119', description: 'Consumo habitual 1 a 2 veces por semana' },
        { tier: 'Ocasionales Silver', percentage: 20, count: 248, avgMonthlySpend: '$25 - $59', description: 'Consumo quincenal o de fin de semana' },
        { tier: 'Nuevos Clientes Bronce', percentage: 10, count: 125, avgMonthlySpend: '$10 - $24', description: 'Primera o segunda orden registrada' }
      ],
      topConsumers: [
        { id: 1, name: 'Sofía Valenzuela', email: 'sofia.v@gmail.com', avatar: '👩🏻', tier: 'VIP Platinum', totalOrders: 38, totalSpent: 642.50, favoriteBurger: 'Rey de las Burgers', lastOrder: 'Hace 2 horas' },
        { id: 2, name: 'Carlos Rodríguez', email: 'carlos.r@outlook.com', avatar: '👨🏽', tier: 'VIP Platinum', totalOrders: 32, totalSpent: 518.20, favoriteBurger: 'Burger Real Doble', lastOrder: 'Hace 14 min' },
        { id: 3, name: 'Andrea Morales', email: 'andrea.m@gmail.com', avatar: '👩🏼', tier: 'Frecuente Gold', totalOrders: 27, totalSpent: 412.00, favoriteBurger: 'Smash Trufa Imperial', lastOrder: 'Ayer' },
        { id: 4, name: 'Fernando Castro', email: 'fcastro@empresa.com', avatar: '👨🏻', tier: 'Frecuente Gold', totalOrders: 21, totalSpent: 329.80, favoriteBurger: 'Burger Doble Especial', lastOrder: 'Hace 3 días' },
        { id: 5, name: 'Valentina Ríos', email: 'vrios@tech.io', avatar: '👩🏽', tier: 'Frecuente Gold', totalOrders: 18, totalSpent: 278.40, favoriteBurger: 'Burger Real Clásica', lastOrder: 'Hace 25 min' }
      ],
      topSellingBurgers: [
        { name: 'Rey de las Burgers', specialty: '👑 Firma de la Casa', salesCount: 142, revenue: 2270.58, percentage: 32 },
        { name: 'Burger Real Doble', specialty: '🔥 Doble Corona', salesCount: 98, revenue: 1371.02, percentage: 22 },
        { name: 'Burger Real Clásica', specialty: '⭐ Clásica Destacada', salesCount: 86, revenue: 945.14, percentage: 19 },
        { name: 'Burger Doble Especial', specialty: '💎 Ultra Especial', salesCount: 65, revenue: 942.50, percentage: 15 },
        { name: 'Smash Trufa Imperial', specialty: '🥇 Selección Gourmet', salesCount: 54, revenue: 917.46, percentage: 12 }
      ],
      hourlyConsumptionPeak: [
        { hour: '11:00', orders: 18 },
        { hour: '12:00', orders: 54 },
        { hour: '13:00', orders: 92 },
        { hour: '14:00', orders: 78 },
        { hour: '19:00', orders: 65 },
        { hour: '20:00', orders: 115 },
        { hour: '21:00', orders: 88 },
        { hour: '22:00', orders: 42 }
      ],
      databaseStatus: dbStatus,
      recentOrders: simulatedOrders
    };

    res.json({ success: true, data: metricsData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simulated order placement endpoint (from PWA)
router.post('/orders', (req, res) => {
  try {
    const { customer, items, total, address, customerType } = req.body;
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customer || 'Cliente Rapid Móvil',
      customerType: customerType || 'Frecuente Gold',
      items: Array.isArray(items) ? items : ['Rey de las Burgers'],
      total: parseFloat(total) || 15.99,
      status: 'En parrilla',
      address: address || 'Dirección de Entrega Predeterminada',
      createdAt: new Date().toISOString()
    };
    simulatedOrders.unshift(newOrder);
    res.status(201).json({ success: true, message: '¡Orden simulada creada con éxito!', data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List simulated orders
router.get('/orders', (req, res) => {
  res.json({ success: true, data: simulatedOrders });
});

module.exports = router;
