/**
 * User Service Tests
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 * Test coverage target: >80%
 */

const {
  createUser, getUser, listUsers,
  updateUser, deleteUser, isValidEmail, resetStore
} = require('../src/userService');

describe('UserService', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('createUser', () => {
    test('creates a valid user', () => {
      const user = createUser({
        name: 'Jane Developer',
        email: 'jane@example.com',
        role: 'developer'
      });

      expect(user).toHaveProperty('id');
      expect(user.name).toBe('Jane Developer');
      expect(user.email).toBe('jane@example.com');
      expect(user.role).toBe('developer');
      expect(user.createdAt).toBeDefined();
    });

    test('normalizes email to lowercase', () => {
      const user = createUser({
        name: 'Test User',
        email: 'Test@Example.COM',
        role: 'viewer'
      });
      expect(user.email).toBe('test@example.com');
    });

    test('trims whitespace from name', () => {
      const user = createUser({
        name: '  Jane Developer  ',
        email: 'jane@example.com',
        role: 'developer'
      });
      expect(user.name).toBe('Jane Developer');
    });

    test('rejects missing name', () => {
      expect(() => createUser({ email: 'a@b.com', role: 'developer' }))
        .toThrow('Name must be a string with at least 2 characters');
    });

    test('rejects short name', () => {
      expect(() => createUser({ name: 'A', email: 'a@b.com', role: 'developer' }))
        .toThrow('Name must be a string with at least 2 characters');
    });

    test('rejects invalid email', () => {
      expect(() => createUser({ name: 'Test', email: 'notanemail', role: 'developer' }))
        .toThrow('A valid email address is required');
    });

    test('rejects missing email', () => {
      expect(() => createUser({ name: 'Test', role: 'developer' }))
        .toThrow('A valid email address is required');
    });

    test('rejects invalid role', () => {
      expect(() => createUser({ name: 'Test', email: 'a@b.com', role: 'superuser' }))
        .toThrow('Role must be one of');
    });

    test('rejects duplicate email', () => {
      createUser({ name: 'First', email: 'same@test.com', role: 'developer' });
      expect(() => createUser({ name: 'Second', email: 'same@test.com', role: 'viewer' }))
        .toThrow('A user with this email already exists');
    });

    test('allows all valid roles', () => {
      const roles = ['admin', 'developer', 'viewer'];
      roles.forEach((role, i) => {
        const user = createUser({
          name: `User ${i}`,
          email: `user${i}@test.com`,
          role
        });
        expect(user.role).toBe(role);
      });
    });
  });

  describe('getUser', () => {
    test('retrieves existing user', () => {
      const created = createUser({ name: 'Get Test', email: 'get@test.com', role: 'viewer' });
      const found = getUser(created.id);
      expect(found).toEqual(created);
    });

    test('returns null for non-existent ID', () => {
      const found = getUser('non-existent-id');
      expect(found).toBeNull();
    });

    test('throws on invalid ID', () => {
      expect(() => getUser(null)).toThrow('Valid user ID is required');
      expect(() => getUser(123)).toThrow('Valid user ID is required');
    });

    test('returns a copy, not the original reference', () => {
      const created = createUser({ name: 'Copy Test', email: 'copy@test.com', role: 'viewer' });
      const found = getUser(created.id);
      found.name = 'Modified';
      const refetch = getUser(created.id);
      expect(refetch.name).toBe('Copy Test');
    });
  });

  describe('listUsers', () => {
    test('lists all users', () => {
      createUser({ name: 'User 1', email: 'u1@test.com', role: 'developer' });
      createUser({ name: 'User 2', email: 'u2@test.com', role: 'admin' });
      const list = listUsers();
      expect(list).toHaveLength(2);
    });

    test('filters by role', () => {
      createUser({ name: 'Dev 1', email: 'dev1@test.com', role: 'developer' });
      createUser({ name: 'Admin 1', email: 'admin1@test.com', role: 'admin' });
      createUser({ name: 'Dev 2', email: 'dev2@test.com', role: 'developer' });

      const devs = listUsers({ role: 'developer' });
      expect(devs).toHaveLength(2);
      expect(devs.every(u => u.role === 'developer')).toBe(true);
    });

    test('respects limit', () => {
      for (let i = 0; i < 10; i++) {
        createUser({ name: `User ${i}`, email: `u${i}@test.com`, role: 'viewer' });
      }
      const limited = listUsers({ limit: 3 });
      expect(limited).toHaveLength(3);
    });

    test('returns empty array when no users', () => {
      expect(listUsers()).toEqual([]);
    });
  });

  describe('updateUser', () => {
    test('updates user name', () => {
      const user = createUser({ name: 'Original', email: 'up@test.com', role: 'developer' });
      const updated = updateUser(user.id, { name: 'Updated Name' });
      expect(updated.name).toBe('Updated Name');
    });

    test('updates user role', () => {
      const user = createUser({ name: 'Role Test', email: 'role@test.com', role: 'developer' });
      const updated = updateUser(user.id, { role: 'admin' });
      expect(updated.role).toBe('admin');
    });

    test('ignores disallowed fields like email', () => {
      const user = createUser({ name: 'Safe', email: 'safe@test.com', role: 'viewer' });
      const updated = updateUser(user.id, { email: 'hacked@evil.com', name: 'Still Safe' });
      expect(updated.email).toBe('safe@test.com');
      expect(updated.name).toBe('Still Safe');
    });

    test('throws for non-existent user', () => {
      expect(() => updateUser('fake-id', { name: 'Nope' }))
        .toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    test('deletes existing user', () => {
      const user = createUser({ name: 'Delete Me', email: 'del@test.com', role: 'viewer' });
      expect(deleteUser(user.id)).toBe(true);
      expect(getUser(user.id)).toBeNull();
    });

    test('returns false for non-existent user', () => {
      expect(deleteUser('no-such-id')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    test('accepts valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@missing.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });
});
