/**
 * User Service
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 * Purpose: User management with validation and security controls
 */

const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with database in production)
const users = new Map();

/**
 * Creates a new user with validation
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.role - User's role (admin, developer, viewer)
 * @returns {Object} Created user object
 * @throws {Error} If validation fails
 */
function createUser({ name, email, role }) {
  // Input validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new Error('Name must be a string with at least 2 characters');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('A valid email address is required');
  }

  const allowedRoles = ['admin', 'developer', 'viewer'];
  if (!role || !allowedRoles.includes(role)) {
    throw new Error(`Role must be one of: ${allowedRoles.join(', ')}`);
  }

  // Check for duplicate email
  for (const [, user] of users) {
    if (user.email === email.toLowerCase()) {
      throw new Error('A user with this email already exists');
    }
  }

  const user = {
    id: uuidv4(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiGenerated: false // Traceability flag
  };

  users.set(user.id, user);
  return { ...user };
}

/**
 * Retrieves a user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User object or null
 */
function getUser(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Valid user ID is required');
  }

  const user = users.get(userId);
  return user ? { ...user } : null;
}

/**
 * Lists all users with optional role filter
 * @param {Object} options - Query options
 * @param {string} [options.role] - Filter by role
 * @param {number} [options.limit=50] - Max results
 * @returns {Array} Array of user objects
 */
function listUsers({ role, limit = 50 } = {}) {
  let result = Array.from(users.values());

  if (role) {
    result = result.filter(u => u.role === role);
  }

  return result.slice(0, Math.min(limit, 100)).map(u => ({ ...u }));
}

/**
 * Updates a user's information
 * @param {string} userId - User ID to update
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated user object
 * @throws {Error} If user not found or validation fails
 */
function updateUser(userId, updates) {
  const user = users.get(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const allowed = ['name', 'role'];
  const sanitized = {};

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      sanitized[key] = updates[key];
    }
  }

  if (sanitized.name && (typeof sanitized.name !== 'string' || sanitized.name.trim().length < 2)) {
    throw new Error('Name must be a string with at least 2 characters');
  }

  if (sanitized.role) {
    const allowedRoles = ['admin', 'developer', 'viewer'];
    if (!allowedRoles.includes(sanitized.role)) {
      throw new Error(`Role must be one of: ${allowedRoles.join(', ')}`);
    }
  }

  Object.assign(user, sanitized, { updatedAt: new Date().toISOString() });
  return { ...user };
}

/**
 * Deletes a user by ID
 * @param {string} userId - User ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
function deleteUser(userId) {
  return users.delete(userId);
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Resets the user store (for testing)
 */
function resetStore() {
  users.clear();
}

module.exports = {
  createUser,
  getUser,
  listUsers,
  updateUser,
  deleteUser,
  isValidEmail,
  resetStore
};
