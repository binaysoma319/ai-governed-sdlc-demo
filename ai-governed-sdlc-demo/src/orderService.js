/**
 * Order Service
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 * Purpose: Order processing with business rule validation
 */

const { v4: uuidv4 } = require('uuid');

// In-memory store
const orders = new Map();

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const VALID_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: []
};

/**
 * Creates a new order
 * @param {Object} orderData - Order data
 * @param {string} orderData.userId - ID of the user placing the order
 * @param {Array} orderData.items - Array of order items
 * @param {string} orderData.items[].name - Item name
 * @param {number} orderData.items[].quantity - Item quantity
 * @param {number} orderData.items[].price - Item unit price
 * @returns {Object} Created order
 */
function createOrder({ userId, items }) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Valid userId is required');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('At least one item is required');
  }

  // Validate each item
  for (const item of items) {
    if (!item.name || typeof item.name !== 'string') {
      throw new Error('Each item must have a valid name');
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error('Item quantity must be a positive integer');
    }
    if (typeof item.price !== 'number' || item.price <= 0) {
      throw new Error('Item price must be a positive number');
    }
  }

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const order = {
    id: uuidv4(),
    userId,
    items: items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    })),
    total: Math.round(total * 100) / 100,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [
      { status: ORDER_STATUS.PENDING, timestamp: new Date().toISOString() }
    ]
  };

  orders.set(order.id, order);
  return { ...order };
}

/**
 * Retrieves an order by ID
 * @param {string} orderId - Order ID
 * @returns {Object|null} Order object or null
 */
function getOrder(orderId) {
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Valid order ID is required');
  }
  const order = orders.get(orderId);
  return order ? { ...order } : null;
}

/**
 * Lists orders for a specific user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {string} [options.status] - Filter by status
 * @returns {Array} Array of orders
 */
function listOrdersByUser(userId, { status } = {}) {
  if (!userId) {
    throw new Error('userId is required');
  }

  let result = Array.from(orders.values()).filter(o => o.userId === userId);

  if (status && Object.values(ORDER_STATUS).includes(status)) {
    result = result.filter(o => o.status === status);
  }

  return result.map(o => ({ ...o }));
}

/**
 * Transitions order to a new status with validation
 * @param {string} orderId - Order ID
 * @param {string} newStatus - Target status
 * @returns {Object} Updated order
 * @throws {Error} If transition is invalid
 */
function updateOrderStatus(orderId, newStatus) {
  const order = orders.get(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  if (!Object.values(ORDER_STATUS).includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  const allowedTransitions = VALID_TRANSITIONS[order.status];
  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Cannot transition from "${order.status}" to "${newStatus}". ` +
      `Allowed: ${allowedTransitions.join(', ') || 'none (terminal state)'}`
    );
  }

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  order.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString()
  });

  return { ...order };
}

/**
 * Calculates order statistics for a user
 * @param {string} userId - User ID
 * @returns {Object} Statistics object
 */
function getOrderStats(userId) {
  const userOrders = Array.from(orders.values()).filter(o => o.userId === userId);

  return {
    totalOrders: userOrders.length,
    totalSpent: Math.round(
      userOrders
        .filter(o => o.status !== ORDER_STATUS.CANCELLED)
        .reduce((sum, o) => sum + o.total, 0) * 100
    ) / 100,
    byStatus: Object.values(ORDER_STATUS).reduce((acc, status) => {
      acc[status] = userOrders.filter(o => o.status === status).length;
      return acc;
    }, {})
  };
}

/**
 * Resets the order store (for testing)
 */
function resetStore() {
  orders.clear();
}

module.exports = {
  createOrder,
  getOrder,
  listOrdersByUser,
  updateOrderStatus,
  getOrderStats,
  resetStore,
  ORDER_STATUS
};
