/**
 * Order Service Tests
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 */

const {
  createOrder, getOrder, listOrdersByUser,
  updateOrderStatus, getOrderStats, resetStore, ORDER_STATUS
} = require('../src/orderService');

describe('OrderService', () => {
  beforeEach(() => {
    resetStore();
  });

  const validItems = [
    { name: 'Widget', quantity: 2, price: 9.99 },
    { name: 'Gadget', quantity: 1, price: 24.50 }
  ];

  describe('createOrder', () => {
    test('creates a valid order', () => {
      const order = createOrder({ userId: 'user-1', items: validItems });
      expect(order).toHaveProperty('id');
      expect(order.userId).toBe('user-1');
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe(ORDER_STATUS.PENDING);
      expect(order.total).toBe(44.48);
    });

    test('calculates correct subtotals', () => {
      const order = createOrder({ userId: 'user-1', items: validItems });
      expect(order.items[0].subtotal).toBe(19.98);
      expect(order.items[1].subtotal).toBe(24.50);
    });

    test('initializes status history', () => {
      const order = createOrder({ userId: 'user-1', items: validItems });
      expect(order.statusHistory).toHaveLength(1);
      expect(order.statusHistory[0].status).toBe(ORDER_STATUS.PENDING);
    });

    test('rejects missing userId', () => {
      expect(() => createOrder({ items: validItems }))
        .toThrow('Valid userId is required');
    });

    test('rejects empty items array', () => {
      expect(() => createOrder({ userId: 'user-1', items: [] }))
        .toThrow('At least one item is required');
    });

    test('rejects item without name', () => {
      expect(() => createOrder({ userId: 'user-1', items: [{ quantity: 1, price: 5 }] }))
        .toThrow('Each item must have a valid name');
    });

    test('rejects invalid quantity', () => {
      expect(() => createOrder({ userId: 'u1', items: [{ name: 'X', quantity: 0, price: 5 }] }))
        .toThrow('Item quantity must be a positive integer');
    });

    test('rejects negative price', () => {
      expect(() => createOrder({ userId: 'u1', items: [{ name: 'X', quantity: 1, price: -5 }] }))
        .toThrow('Item price must be a positive number');
    });
  });

  describe('getOrder', () => {
    test('retrieves existing order', () => {
      const created = createOrder({ userId: 'u1', items: validItems });
      const found = getOrder(created.id);
      expect(found.id).toBe(created.id);
    });

    test('returns null for non-existent order', () => {
      expect(getOrder('no-such-id')).toBeNull();
    });

    test('throws on invalid ID', () => {
      expect(() => getOrder(null)).toThrow('Valid order ID is required');
    });
  });

  describe('listOrdersByUser', () => {
    test('lists orders for a user', () => {
      createOrder({ userId: 'u1', items: validItems });
      createOrder({ userId: 'u1', items: validItems });
      createOrder({ userId: 'u2', items: validItems });

      const u1Orders = listOrdersByUser('u1');
      expect(u1Orders).toHaveLength(2);
    });

    test('filters by status', () => {
      const order = createOrder({ userId: 'u1', items: validItems });
      createOrder({ userId: 'u1', items: validItems });
      updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED);

      const confirmed = listOrdersByUser('u1', { status: ORDER_STATUS.CONFIRMED });
      expect(confirmed).toHaveLength(1);
    });
  });

  describe('updateOrderStatus', () => {
    test('transitions pending to confirmed', () => {
      const order = createOrder({ userId: 'u1', items: validItems });
      const updated = updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED);
      expect(updated.status).toBe(ORDER_STATUS.CONFIRMED);
      expect(updated.statusHistory).toHaveLength(2);
    });

    test('follows valid transition chain', () => {
      const order = createOrder({ userId: 'u1', items: validItems });
      updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED);
      updateOrderStatus(order.id, ORDER_STATUS.PROCESSING);
      updateOrderStatus(order.id, ORDER_STATUS.SHIPPED);
      const delivered = updateOrderStatus(order.id, ORDER_STATUS.DELIVERED);
      expect(delivered.status).toBe(ORDER_STATUS.DELIVERED);
      expect(delivered.statusHistory).toHaveLength(5);
    });

    test('rejects invalid transition', () => {
      const order = createOrder({ userId: 'u1', items: validItems });
      expect(() => updateOrderStatus(order.id, ORDER_STATUS.SHIPPED))
        .toThrow('Cannot transition from "pending" to "shipped"');
    });

    test('rejects transition from terminal state', () => {
      const order = createOrder({ userId: 'u1', items: validItems });
      updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED);
      updateOrderStatus(order.id, ORDER_STATUS.PROCESSING);
      updateOrderStatus(order.id, ORDER_STATUS.SHIPPED);
      updateOrderStatus(order.id, ORDER_STATUS.DELIVERED);
      expect(() => updateOrderStatus(order.id, ORDER_STATUS.CANCELLED))
        .toThrow('none (terminal state)');
    });

    test('allows cancellation from pending', () => {
      const order = createOrder({ userId: 'u1', items: validItems });
      const cancelled = updateOrderStatus(order.id, ORDER_STATUS.CANCELLED);
      expect(cancelled.status).toBe(ORDER_STATUS.CANCELLED);
    });
  });

  describe('getOrderStats', () => {
    test('returns stats for user', () => {
      createOrder({ userId: 'u1', items: [{ name: 'A', quantity: 1, price: 10 }] });
      createOrder({ userId: 'u1', items: [{ name: 'B', quantity: 2, price: 20 }] });

      const stats = getOrderStats('u1');
      expect(stats.totalOrders).toBe(2);
      expect(stats.totalSpent).toBe(50);
    });

    test('excludes cancelled orders from total spent', () => {
      const order = createOrder({ userId: 'u1', items: [{ name: 'A', quantity: 1, price: 100 }] });
      createOrder({ userId: 'u1', items: [{ name: 'B', quantity: 1, price: 50 }] });
      updateOrderStatus(order.id, ORDER_STATUS.CANCELLED);

      const stats = getOrderStats('u1');
      expect(stats.totalOrders).toBe(2);
      expect(stats.totalSpent).toBe(50);
    });

    test('returns zero stats for user with no orders', () => {
      const stats = getOrderStats('no-orders');
      expect(stats.totalOrders).toBe(0);
      expect(stats.totalSpent).toBe(0);
    });
  });
});
