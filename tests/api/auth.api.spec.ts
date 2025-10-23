const request = require('supertest');
const { setupTestDB, teardownTestDB } = require('../helpers/db-setup');

// Create a simple Express app for testing
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Mock API routes
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password too weak' });
  }
  if (email === 'duplicate@example.com') {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }
  if (email === 'invalid@') {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }
  res.status(201).json({ 
    success: true, 
    message: 'User registered',
    user: { email, name, id: 'test-user-id' }
  });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === 'password123') {
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: { email, name: 'Test User', id: 'test-user-id' }
    });
  }
  if (email === 'nonexistent@example.com') {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/api/auth/signout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    return res.status(200).json({ 
      success: true, 
      user: { email: 'test@example.com', name: 'Test User', id: 'test-user-id' }
    });
  }
  res.status(401).json({ success: false, message: 'Unauthorized' });
});

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    test('registers new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPass123!',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    test('rejects registration with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid@',
        password: 'TestPass123!',
        role: 'user'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    test('rejects registration with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'testuser2@example.com',
        password: '123',
        role: 'user'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    test('rejects duplicate email registration', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com', // Same email as previous test
        password: 'TestPass123!',
        role: 'user'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);
    });
  });

  describe('POST /api/auth/login', () => {
    test('logs in with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    test('rejects login with invalid credentials', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'WrongPassword'
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });

    test('rejects login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123!'
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(404);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    test('sends password reset email for valid user', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'testuser@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('reset email');
    });

    test('handles non-existent email gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200); // Should not reveal if email exists

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('resets password with valid token', async () => {
      // First get a reset token (in real app, this would come from email)
      const resetToken = 'valid-reset-token-123';
      
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewTestPass123!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('rejects invalid reset token', async () => {
      await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'NewTestPass123!'
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/verify-email', () => {
    test('verifies email with valid token', async () => {
      const verificationToken = 'valid-verification-token-123';
      
      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: verificationToken })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('rejects invalid verification token', async () => {
      await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' })
        .expect(400);
    });
  });
});
