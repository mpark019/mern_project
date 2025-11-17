# Unit Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit testing.

## Running Tests

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located in the `src/__tests__` directory, mirroring the source structure:

```
src/
  __tests__/
    controllers/
      calorieController.test.ts
    models/
      calorieModel.test.ts
    middleware/
      authMiddleware.test.ts
    ...
```

## Writing Tests

### Testing Controllers

Controllers are tested by mocking:
- Database models (Mongoose)
- Request/Response objects
- Authentication middleware

Example:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';

// Mock the model
vi.mock('../../models/calorieModel');

describe('Controller Name', () => {
  it('should do something', async () => {
    // Arrange
    const mockRequest = { body: {}, user: { userId: '...' } };
    const mockResponse = { status: vi.fn(), json: vi.fn() };
    
    // Act
    await controllerFunction(mockRequest, mockResponse);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});
```

### Testing Models

Models are tested by:
- Validating schema constraints
- Testing validation rules
- Mocking Mongoose operations

### Testing Middleware

Middleware is tested by:
- Mocking Request/Response/Next objects
- Testing authentication logic
- Testing error handling

## Mocking

### Mocking Mongoose Models

```typescript
vi.mock('../../models/calorieModel', () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
  },
}));
```

### Mocking Express Request/Response

```typescript
const mockRequest = {
  body: {},
  params: {},
  user: { userId: '...' },
} as Partial<Request>;

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
} as Partial<Response>;
```

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Use descriptive names**: Test names should clearly describe what they test
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**: Database, APIs, file system
5. **Test edge cases**: Invalid input, missing data, errors
6. **Keep tests fast**: Use mocks instead of real database connections

## Coverage Goals

Aim for:
- 80%+ code coverage
- 100% coverage for critical business logic
- Test all error paths

