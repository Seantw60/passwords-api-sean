import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('Authentication', () => {
  let testUserId;

  beforeAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'test@' } },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'test@' } },
    });
    await prisma.$disconnect();
  });

  describe('Signup', () => {
    it('should create a new user with valid data', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          password: 'Password123!',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      testUserId = data.user.id;
    });

    it('should reject weak passwords', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'weak',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject duplicate emails', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          password: 'Password123!',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toContain('already exists');
    });
  });

  describe('Login', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123!',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBeDefined();
    });

    it('should reject non-existent user', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(401);
      expect(data.error).toBeDefined();
    });
  });

  describe('Password Reset', () => {
    it('should request password reset', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.message).toBeDefined();
    });

    it('should not reveal if email exists', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      // Should return same message regardless of email existence
      expect(data.message).toBeDefined();
    });
  });
});
