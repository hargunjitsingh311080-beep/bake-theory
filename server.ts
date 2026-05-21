import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const DB_FILE = path.join(process.cwd(), 'orders-db.json');

  // Helper to load orders
  function loadOrders() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error reading database", e);
    }
    return [];
  }

  // Helper to save orders
  function saveOrders(orders: any) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error writing database", e);
    }
  }

  // API endpoints
  app.get('/api/orders', (req, res) => {
    res.json(loadOrders());
  });

  app.post('/api/orders/save-all', (req, res) => {
    const ordersList = req.body;
    if (Array.isArray(ordersList)) {
      saveOrders(ordersList);
      res.json({ success: true, count: ordersList.length });
    } else {
      res.status(400).json({ error: "Expected an array of orders" });
    }
  });

  app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    if (!newOrder || !newOrder.id) {
       res.status(400).json({ error: "Invalid order data" });
       return;
    }
    const orders = loadOrders();
    // Prevent duplicate IDs
    const existingIndex = orders.findIndex((o: any) => o.id === newOrder.id);
    if (existingIndex !== -1) {
      orders[existingIndex] = newOrder;
    } else {
      orders.unshift(newOrder); // Add new orders at the top
    }
    saveOrders(orders);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;
    const orders = loadOrders();
    const idx = orders.findIndex((o: any) => o.id === id);
    if (idx === -1) {
       res.status(404).json({ error: "Order not found" });
       return;
    }
    orders[idx] = { ...orders[idx], ...updatedFields };
    saveOrders(orders);
    res.json(orders[idx]);
  });

  // Vite Integration for Serving UI
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bake Theory server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
