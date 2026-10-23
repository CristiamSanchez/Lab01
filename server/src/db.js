const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  // --- 10 VARIANTES DESTACADAS DE HAMBURGUESAS "HAMBURGER RAPID" ---
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    price: 15.99,
    stock: 50,
    specialty_level: '👑 Firma de la Casa',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Triple carne Angus certificada flameada a la leña de roble, queso cheddar añejo fundido, cebolla caramelizada al bourbon, bacon ahumado crujiente y salsa imperial secreta en pan brioche artesanal tostado con mantequilla.',
    ingredients: 'Triple carne Angus (250g), Cheddar añejo 12m, Bacon ahumado crujiente, Cebolla al bourbon, Salsa imperial secreta, Pan brioche artesanal.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    price: 10.99,
    stock: 75,
    specialty_level: '⭐ Clásica Destacada',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Nuestra receta insignia perfeccionada: medallón de res jugoso a la parrilla de carbón vivo, queso americano derretido, lechuga romana crujiente, tomate fresco de huerto, pepinillos agridulces y aderezo especial Rapid.',
    ingredients: 'Medallón de res (180g), Queso americano fundido, Lechuga romana fresca, Tomate en rodajas, Pepinillos artesanales, Aderezo clásico Rapid.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Clásicas',
    price: 13.99,
    stock: 60,
    specialty_level: '🔥 Doble Corona',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada perfecta, doble queso cheddar fundido entre cada capa, tiras de tocino ahumado extra crocante y cebolla morada encurtida.',
    ingredients: 'Doble medallón smash (300g), Doble queso cheddar madurado, Tiras de tocino ahumado, Cebolla morada encurtida, Pan de papa dorado.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    price: 14.50,
    stock: 40,
    specialty_level: '💎 Ultra Especial',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    description: 'Dos medallones de carne Angus premium con queso gouda ahumado, champiñones frescos salteados a la mantequilla de finas hierbas y suave emulsión de ajo negro.',
    ingredients: '2x Carne Angus (300g total), Queso gouda ahumado, Champiñones portobello al ajillo, Emulsión de ajo negro, Rúcula fresca.'
  },
  {
    id: 5,
    name: 'Smash Trufa Imperial',
    category: 'Gourmet',
    price: 16.99,
    stock: 35,
    specialty_level: '🥇 Selección Gourmet',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1583032015879-66170d49f056?w=600&auto=format&fit=crop&q=80',
    description: 'Doble smash de carne madurada 45 días, queso brie francés derretido, mayonesa casera de trufa negra de verano y crujiente de cebolla frita en pan dorado con sésamo negro.',
    ingredients: 'Carne madurada Dry Aged (280g), Queso brie derretido, Salsa de trufa negra, Crispy onions, Pan brioche francés.'
  },
  {
    id: 6,
    name: 'Crispy Smokehouse Chicken',
    category: 'Pollo Crispy',
    price: 11.99,
    stock: 48,
    specialty_level: '🍗 Crujiente Maestro',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Pechuga entera de pollo marinada 24h en suero de leche y 11 especias secretas con rebozado extra crocante, ensalada coleslaw de manzana verde y miel con chipotle ahumado.',
    ingredients: 'Pechuga crujiente de pollo (220g), Coleslaw fresca con manzana verde, Miel de chipotle dulce-picante, Pepinillos dulces.'
  },
  {
    id: 7,
    name: 'Bacon BBQ Supreme',
    category: 'Especiales',
    price: 13.50,
    stock: 55,
    specialty_level: '🥓 Favorita Ahumada',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón grueso de carne Angus envuelto en abundante tocino glaseado en salsa BBQ artesanal al whisky de Tennessee, aros de cebolla crocantes y queso monterrey jack.',
    ingredients: 'Carne Angus (200g), Tocino caramelizado al whisky BBQ, Queso Monterrey Jack, Aros de cebolla dorados, Pan artesanal.'
  },
  {
    id: 8,
    name: 'Volcán Cheddar Melt',
    category: 'Especiales',
    price: 14.99,
    stock: 30,
    specialty_level: '🧀 Explosión de Queso',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    description: 'Para los auténticos fanáticos del queso: medallón de res bañado en una cascada de salsa de queso cheddar caliente al momento de servir, salpicado con bacon bits y jalapeños suaves.',
    ingredients: 'Medallón de res (220g), Cascada volcánica de queso cheddar caliente, Bits de tocino frito, Rodajas de jalapeño suave.'
  },
  {
    id: 9,
    name: 'Veggie Portobello Gourmet',
    category: 'Gourmet',
    price: 12.50,
    stock: 25,
    specialty_level: '🌱 100% Plant & Earth',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80',
    description: 'Sombrero de hongo Portobello gigante marinado al balsámico a la parrilla, queso de cabra caramelizado, tomates secos confitados, pesto de albahaca fresca y brotes tiernos.',
    ingredients: 'Hongo Portobello entero a la leña, Queso de cabra tibio, Tomates confitados al romero, Pesto genovés, Pan rústico semillado.'
  },
  {
    id: 10,
    name: 'Triple Fuego Habanero',
    category: 'Especiales',
    price: 15.50,
    stock: 28,
    specialty_level: '🌶️ Ultra Spicy Fuego',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    description: 'Tres medallones smash sazonados con pimientas rojas, queso pepper jack fundido, jalea casera de habanero tostado, guacamole fresco para contrastar y jalapeños crocantes.',
    ingredients: '3x Medallones smash (330g), Queso pepper jack picante, Mermelada casera de habanero, Guacamole cremoso, Pan brioche al ají.'
  },

  // --- COMPLEMENTOS & BEBIDAS DESTACADAS (4) ---
  {
    id: 11,
    name: 'Papas Rústicas Trufa & Parmesano',
    category: 'Complementos',
    price: 5.50,
    stock: 80,
    specialty_level: '🍟 Acompañamiento VIP',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    description: 'Papas cortadas a mano con piel, fritas dos veces, aderezadas con aceite de trufa blanca de alba, queso parmesano reggiano rallado y perejil fresco.',
    ingredients: 'Papas agria rústicas, Aceite de trufa blanca, Parmigiano-Reggiano D.O.P., Sal marina escamada.'
  },
  {
    id: 12,
    name: 'Aros de Cebolla Beer-Battered',
    category: 'Complementos',
    price: 4.90,
    stock: 65,
    specialty_level: '🧅 Crujiente Dorado',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1639024471287-035216709841?w=600&auto=format&fit=crop&q=80',
    description: 'Aros de cebolla dulce rebozados en masa crujiente de cerveza artesanal rubia servidos con dip de mayonesa sriracha.',
    ingredients: 'Cebolla dulce vidalia, Rebozado de cerveza rubia artesanal, Salsa alioli sriracha ahumada.'
  },
  {
    id: 13,
    name: 'Milkshake Vainilla Bourbon & Caramelo',
    category: 'Bebidas',
    price: 5.99,
    stock: 45,
    specialty_level: '🥤 Dulce Placer',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    description: 'Helado artesanal de vainilla de Madagascar batido con leche entera, jarabe de caramelo salado al bourbon y crema chantilly montada con virutas de galleta.',
    ingredients: 'Helado de vainilla natural, Toffee de caramelo salado, Crema chantilly, Topping de galleta crocante.'
  },
  {
    id: 14,
    name: 'Rapid Artesanal IPA 473ml',
    category: 'Bebidas',
    price: 4.50,
    stock: 70,
    specialty_level: '🍺 Cerveza de la Casa',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1608270199182-3d5f9922e379?w=600&auto=format&fit=crop&q=80',
    description: 'Cerveza artesanal estilo Indian Pale Ale, notas cítricas a maracuyá y pomelo, balance amargo perfecto para maridar con hamburguesas.',
    ingredients: 'Lúpulos Citra y Mosaic, Malta de cebada, Agua pura de manantial. 5.8% Alc. Vol.'
  }
];

let inMemoryProducts = [...INITIAL_PRODUCTS];
let pool = null;
let isConnectedToMySQL = false;
let lastDbError = null;

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'hamburger_rapid';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!databaseUrl && !host) {
    lastDbError = 'Variables DB_HOST ni DATABASE_URL configuradas.';
    console.log(`ℹ️ [DB] ${lastDbError} Operando en modo In-Memory para demostración.`);
    return;
  }

  try {
    if (databaseUrl) {
      console.log(`🔄 [DB] Intentando conectar a MySQL vía DATABASE_URL...`);
      pool = mysql.createPool(databaseUrl);
    } else {
      console.log(`🔄 [DB] Intentando conectar a MySQL en ${host}:${port} a la BD "${database}"...`);
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });
    }

    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conectado exitosamente a MySQL (${host || 'URL'} - BD: ${database})`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        specialty_level VARCHAR(100),
        rating DECIMAL(3,1) DEFAULT 4.9,
        image VARCHAR(500),
        description TEXT,
        ingredients TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 [DB] Inicializando catálogo de Hamburguesas Rapid en MySQL...');
      for (const p of INITIAL_PRODUCTS) {
        await connection.query(
          'INSERT INTO products (name, category, price, stock, specialty_level, rating, image, description, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.price, p.stock, p.specialty_level, p.rating, p.image, p.description, p.ingredients]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL: ${error.message}. Operando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return rows;
    } catch (err) {
      console.error('Error consultando MySQL, recurriendo a memoria temporal:', err.message);
      lastDbError = err.message;
    }
  }
  return inMemoryProducts;
}

async function addProduct({ name, category, price, stock, specialty_level, rating, image, description, ingredients }) {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  const cleanProduct = {
    name,
    category: category || 'Especiales',
    price: parseFloat(price) || 0,
    stock: parseInt(stock, 10) || 0,
    specialty_level: specialty_level || '⭐ Especialidad de la Casa',
    rating: parseFloat(rating) || 4.9,
    image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: description || 'Hamburguesa artesanal premium preparada al momento.',
    ingredients: ingredients || 'Carne Angus seleccionada, pan brioche recién horneado y vegetales frescos.'
  };

  if (isConnectedToMySQL && pool) {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, price, stock, specialty_level, rating, image, description, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        cleanProduct.name,
        cleanProduct.category,
        cleanProduct.price,
        cleanProduct.stock,
        cleanProduct.specialty_level,
        cleanProduct.rating,
        cleanProduct.image,
        cleanProduct.description,
        cleanProduct.ingredients
      ]
    );
    return { id: result.insertId, ...cleanProduct };
  }

  const newProduct = {
    id: Date.now(),
    ...cleanProduct
  };
  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function updateProductStock(id, newStock) {
  const numId = parseInt(id, 10);
  const parsedStock = Math.max(0, parseInt(newStock, 10) || 0);

  if (isConnectedToMySQL && pool) {
    await pool.query('UPDATE products SET stock = ? WHERE id = ?', [parsedStock, numId]);
    return true;
  }
  const item = inMemoryProducts.find(p => p.id === numId);
  if (item) {
    item.stock = parsedStock;
    return true;
  }
  return false;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    await pool.query('DELETE FROM products WHERE id = ?', [numId]);
    return true;
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  if (isConnectedToMySQL && pool) {
    await pool.query('TRUNCATE TABLE products');
    for (const p of INITIAL_PRODUCTS) {
      await pool.query(
        'INSERT INTO products (name, category, price, stock, specialty_level, rating, image, description, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.category, p.price, p.stock, p.specialty_level, p.rating, p.image, p.description, p.ingredients]
      );
    }
    return;
  }
  inMemoryProducts = [...INITIAL_PRODUCTS];
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via-database-url' : 'in-memory (demostración)'),
    database: process.env.DB_NAME || 'hamburger_rapid',
    user: process.env.DB_USER || 'rapid_admin',
    port: process.env.DB_PORT || 3306,
    error: lastDbError
  };
}

module.exports = {
  INITIAL_PRODUCTS,
  initDB,
  getProducts,
  addProduct,
  updateProductStock,
  deleteProduct,
  resetProducts,
  getDbStatus
};
