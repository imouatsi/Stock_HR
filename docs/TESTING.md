# Testing Guide

## Unit Testing
```bash
# Backend Tests
npm run test:unit
npm run test:coverage

# Frontend Tests
npm run test:components
npm run test:integration
```

## E2E Testing
```bash
# Using Cypress
npm run test:e2e

# Using Playwright
npm run test:playwright
```

## Load Testing
```bash
# Using k6
k6 run tests/performance/load-test.js

# Using Artillery
artillery run tests/performance/scenarios.yml
```

# Testing Documentation

## Unit Tests

### User Model Tests
```typescript
describe('User Model', () => {
  test('should create user with valid username', async () => {
    const userData = {
      username: 'U00001',
      password: 'Test@123',
      role: 'user'
    };
    const user = await User.create(userData);
    expect(user.username).toBe('U00001');
    expect(user.role).toBe('user');
    expect(user.isAuthorized).toBe(false);
  });

  test('should not create user with invalid username format', async () => {
    const userData = {
      username: 'invalid',
      password: 'Test@123',
      role: 'user'
    };
    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should not create user with duplicate username', async () => {
    const userData = {
      username: 'U00001',
      password: 'Test@123',
      role: 'user'
    };
    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should hash password before saving', async () => {
    const userData = {
      username: 'U00001',
      password: 'Test@123',
      role: 'user'
    };
    const user = await User.create(userData);
    expect(user.password).not.toBe('Test@123');
    expect(user.password).toMatch(/^\$2[aby]\$\d+\$/);
  });
});
```

### Authentication Tests
```typescript
describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    const userData = {
      username: 'U00001',
      password: 'Test@123',
      role: 'user',
      isAuthorized: true
    };
    await User.create(userData);
    const response = await loginUser({
      username: 'U00001',
      password: 'Test@123'
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe('U00001');
  });

  test('should not login with invalid credentials', async () => {
    const response = await loginUser({
      username: 'U00001',
      password: 'Wrong@123'
    });
    expect(response.status).toBe(401);
  });

  test('should not login with unauthorized account', async () => {
    const userData = {
      username: 'U00001',
      password: 'Test@123',
      role: 'user',
      isAuthorized: false
    };
    await User.create(userData);
    const response = await loginUser({
      username: 'U00001',
      password: 'Test@123'
    });
    expect(response.status).toBe(401);
  });
});
```

## Integration Tests

### User API Tests
```typescript
describe('User API', () => {
  test('should register new user', async () => {
    const response = await registerUser({
      username: 'U00001',
      password: 'Test@123',
      role: 'user'
    });
    expect(response.status).toBe(201);
    expect(response.body.data.user.username).toBe('U00001');
    expect(response.body.data.user.isAuthorized).toBe(false);
  });

  test('should get user profile', async () => {
    const user = await createTestUser();
    const token = await loginAndGetToken(user);
    const response = await getProfile(token);
    expect(response.status).toBe(200);
    expect(response.body.data.user.username).toBe(user.username);
  });

  test('should update user profile', async () => {
    const user = await createTestUser();
    const token = await loginAndGetToken(user);
    const response = await updateProfile(token, {
      firstName: 'John',
      lastName: 'Doe'
    });
    expect(response.status).toBe(200);
    expect(response.body.data.user.firstName).toBe('John');
    expect(response.body.data.user.lastName).toBe('Doe');
  });
});
```

### Admin API Tests
```typescript
describe('Admin API', () => {
  test('should get all users', async () => {
    const admin = await createTestAdmin();
    const token = await loginAndGetToken(admin);
    const response = await getUsers(token);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.users)).toBe(true);
  });

  test('should authorize user', async () => {
    const admin = await createTestAdmin();
    const user = await createTestUser();
    const token = await loginAndGetToken(admin);
    const response = await authorizeUser(token, user.id);
    expect(response.status).toBe(200);
    expect(response.body.data.user.isAuthorized).toBe(true);
  });

  test('should not authorize user without admin role', async () => {
    const user = await createTestUser();
    const token = await loginAndGetToken(user);
    const response = await authorizeUser(token, user.id);
    expect(response.status).toBe(403);
  });
});
```

## Test Utilities

### Test Helpers
```typescript
const createTestUser = async (data = {}) => {
  return User.create({
    username: 'U00001',
    password: 'Test@123',
    role: 'user',
    isAuthorized: true,
    ...data
  });
};

const createTestAdmin = async (data = {}) => {
  return User.create({
    username: 'UA00001',
    password: 'Test@123',
    role: 'admin',
    isAuthorized: true,
    ...data
  });
};

const loginAndGetToken = async (user) => {
  const response = await loginUser({
    username: user.username,
    password: 'Test@123'
  });
  return response.body.token;
};
```

## Test Coverage

### Coverage Requirements
- User model: 100%
- Authentication: 100%
- User API: 100%
- Admin API: 100%

### Coverage Report
```bash
npm run test:coverage
```

## Best Practices

### Test Organization
- Group related tests
- Use descriptive names
- Follow AAA pattern
- Clean up after tests

### Test Data
- Use factory functions
- Clean up test data
- Use realistic data
- Avoid hardcoding

### Test Performance
- Run tests in parallel
- Use test database
- Clean up resources
- Monitor test duration
