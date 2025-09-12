import { POST } from '@/app/api/auth/register/route'
import { NextRequest } from 'next/server'

// Mock the database connection
jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}))

// Mock the User model
jest.mock('@/lib/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}))

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    const { User } = require('@/lib/models')
    const { hash } = require('bcryptjs')

    // Mock user not existing
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({
      _id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    })

    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.message).toBe('User registered successfully')
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.name).toBe('Test User')
    expect(data.user.role).toBe('user')
    expect(data.user.password).toBeUndefined() // Password should not be returned

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'user',
    })
    expect(hash).toHaveBeenCalledWith('password123', 12)
  })

  it('should return error if user already exists', async () => {
    const { User } = require('@/lib/models')

    // Mock user already existing
    User.findOne.mockResolvedValue({
      _id: 'existing-user-id',
      email: 'test@example.com',
    })

    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('User already exists')
    expect(User.create).not.toHaveBeenCalled()
  })

  it('should return error for invalid email format', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
      role: 'user',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Invalid email format')
  })

  it('should return error for weak password', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
      role: 'user',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Password must be at least 8 characters')
  })

  it('should return error for missing required fields', async () => {
    const requestBody = {
      email: 'test@example.com',
      // Missing name and password
    }

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Name and password are required')
  })

  it('should handle database errors gracefully', async () => {
    const { User } = require('@/lib/models')

    // Mock user not existing but database error on create
    User.findOne.mockResolvedValue(null)
    User.create.mockRejectedValue(new Error('Database connection failed'))

    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Internal server error')
  })
})


