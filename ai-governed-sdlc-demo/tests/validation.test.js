/**
 * Validation Middleware Tests
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 */

const { sanitizeString, validateBody, validateUUID } = require('../src/validationMiddleware');

describe('ValidationMiddleware', () => {

  describe('sanitizeString', () => {
    test('removes angle brackets', () => {
      expect(sanitizeString('<script>alert("xss")</script>'))
        .toBe('scriptalert("xss")/script');
    });

    test('removes javascript: protocol', () => {
      expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
    });

    test('removes event handlers', () => {
      expect(sanitizeString('onerror=alert(1)')).toBe('alert(1)');
    });

    test('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    test('returns non-strings unchanged', () => {
      expect(sanitizeString(123)).toBe(123);
      expect(sanitizeString(null)).toBe(null);
    });
  });

  describe('validateBody', () => {
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    test('passes with valid required fields', () => {
      const req = { body: { name: 'Test', email: 'a@b.com' } };
      const res = mockRes();
      const next = jest.fn();

      validateBody(['name', 'email'])(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('rejects missing body', () => {
      const req = { body: null };
      const res = mockRes();
      const next = jest.fn();

      validateBody(['name'])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('rejects missing required fields', () => {
      const req = { body: { name: 'Test' } };
      const res = mockRes();
      const next = jest.fn();

      validateBody(['name', 'email'])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 'MISSING_FIELDS', fields: ['email'] })
      );
    });

    test('sanitizes string fields', () => {
      const req = { body: { name: '<b>Bold</b>' } };
      const res = mockRes();
      const next = jest.fn();

      validateBody([])(req, res, next);
      expect(req.body.name).toBe('bBold/b');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateUUID', () => {
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    test('passes valid UUID v4', () => {
      const req = { params: { id: '550e8400-e29b-41d4-a716-446655440000' } };
      const res = mockRes();
      const next = jest.fn();

      validateUUID('id')(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('rejects invalid UUID', () => {
      const req = { params: { id: 'not-a-uuid' } };
      const res = mockRes();
      const next = jest.fn();

      validateUUID('id')(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('rejects missing parameter', () => {
      const req = { params: {} };
      const res = mockRes();
      const next = jest.fn();

      validateUUID('id')(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
