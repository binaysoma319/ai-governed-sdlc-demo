/**
 * AI-Governed SDLC Demo - API Server
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 * Purpose: REST API demonstrating secure, governed development patterns
 */

const express = require('express');
const helmet = require('helmet');
const userService = require('./userService');
const orderService = require('./orderService');
const {
  validateBody,
  validateUUID,
  simpleRateLimit,
  errorHandler
} = require('./validationMiddleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(simpleRateLimit({ windowMs: 60000, maxRequests: 100 }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    governance: 'AI-assisted with human review'
  });
});

// ──────────────────────────────────────
// User Routes
// ──────────────────────────────────────

app.post('/api/users',
  validateBody(['name', 'email', 'role']),
  (req, res, next) => {
    try {
      const user = userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.get('/api/users', (req, res) => {
  const { role, limit } = req.query;
  const users = userService.listUsers({
    role,
    limit: limit ? parseInt(limit, 10) : undefined
  });
  res.json({ data: users, count: users.length });
});

app.get('/api/users/:id',
  validateUUID('id'),
  (req, res) => {
    const user = userService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  }
);

app.put('/api/users/:id',
  validateUUID('id'),
  (req, res) => {
    try {
      const user = userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      const status = err.message === 'User not found' ? 404 : 400;
      res.status(status).json({ error: err.message });
    }
  }
);

app.delete('/api/users/:id',
  validateUUID('id'),
  (req, res) => {
    const deleted = userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  }
);

// ──────────────────────────────────────
// Order Routes
// ──────────────────────────────────────

app.post('/api/orders',
  validateBody(['userId', 'items']),
  (req, res) => {
    try {
      const order = orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.get('/api/orders/:id',
  validateUUID('id'),
  (req, res) => {
    const order = orderService.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  }
);

app.get('/api/users/:id/orders',
  validateUUID('id'),
  (req, res) => {
    const { status } = req.query;
    const userOrders = orderService.listOrdersByUser(req.params.id, { status });
    res.json({ data: userOrders, count: userOrders.length });
  }
);

app.patch('/api/orders/:id/status',
  validateUUID('id'),
  validateBody(['status']),
  (req, res) => {
    try {
      const order = orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err) {
      const status = err.message === 'Order not found' ? 404 : 400;
      res.status(status).json({ error: err.message });
    }
  }
);

app.get('/api/users/:id/orders/stats',
  validateUUID('id'),
  (req, res) => {
    const stats = orderService.getOrderStats(req.params.id);
    res.json(stats);
  }
);

// Error handler
app.use(errorHandler);

// Start server (only when run directly)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`AI-Governed SDLC Demo API running on port ${PORT}`);
  });
}

module.exports = app;
