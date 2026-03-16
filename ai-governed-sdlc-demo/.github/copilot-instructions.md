# Copilot Instructions for AI-Governed SDLC Demo

## Project Context
This is a Node.js REST API demonstrating AI-governed software delivery.
The project enforces strict input validation, security controls, and test coverage.

## Coding Standards

### General Rules
- Use `const` for all variables unless reassignment is needed, then use `let`
- Never use `var`
- Use strict equality (`===`) always
- Never use `eval()`, `new Function()`, or `setTimeout/setInterval` with strings
- All functions must have JSDoc comments
- All exported functions must have parameter validation

### Security Rules
- Never hardcode secrets, API keys, passwords, or tokens
- Never log sensitive data (passwords, tokens, PII)
- Always validate and sanitize user input
- Always use parameterized queries (no string concatenation for queries)
- Use `helmet` for HTTP security headers
- Implement rate limiting on all public endpoints

### Testing Rules
- Every new function must have corresponding unit tests
- Test both success and failure paths
- Test edge cases (null, undefined, empty strings, boundary values)
- Minimum 80% code coverage
- Use descriptive test names: `test('rejects invalid email format')`

### API Design Rules
- Use proper HTTP status codes (201 for creation, 204 for deletion, 400 for validation, 404 for not found)
- Return consistent error response format: `{ error: string, code: string }`
- Validate all path parameters (especially UUIDs)
- Validate all request body fields before processing

### File Structure
- Business logic in `src/` (one service per domain)
- Tests in `tests/` (mirror src/ structure with `.test.js` suffix)
- Each service file must include AI generation metadata in header comments

### AI Traceability
When generating code, include this header in every file:
```
/**
 * [Module Name]
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 * Purpose: [Brief description]
 */
```

## Do NOT
- Generate code that accesses production databases
- Generate code that handles real payment processing
- Generate code that stores or processes real PII
- Generate code with hardcoded credentials
- Generate code that disables security middleware
- Skip input validation for any user-facing endpoint
