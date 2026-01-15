import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('Blog Posts', () => {
  let authToken;
  let userId;
  let postId;

  beforeAll(async () => {
    // Create test user and login
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'testpost@example.com',
        name: 'Test Post User',
        passwordHash: hashedPassword,
        role: 'EDITOR',
      },
    });
    userId = user.id;

    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testpost@example.com',
        password: 'Password123!',
      }),
    });

    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  afterAll(async () => {
    // Clean up
    await prisma.post.deleteMany({
      where: { authorId: userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    await prisma.$disconnect();
  });

  describe('Create Post', () => {
    it('should create a new post', async () => {
      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Test Post',
          content: 'This is a test post content',
          slug: 'test-post',
          status: 'DRAFT',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.post.id).toBeDefined();
      expect(data.post.title).toBe('Test Post');
      postId = data.post.id;
    });

    it('should reject invalid data', async () => {
      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: '', // Invalid: empty title
          content: 'Content',
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Get Posts', () => {
    it('should get list of posts with pagination', async () => {
      const response = await fetch(`${BASE_URL}/api/posts?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.posts).toBeInstanceOf(Array);
      expect(data.pagination).toBeDefined();
    });
  });

  describe('Update Post', () => {
    it('should update own post', async () => {
      const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Updated Test Post',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.post.title).toBe('Updated Test Post');
    });
  });

  describe('Bulk Operations', () => {
    it('should bulk update posts', async () => {
      // Create another post
      const post2 = await prisma.post.create({
        data: {
          title: 'Post 2',
          content: 'Content 2',
          slug: 'post-2',
          authorId: userId,
          status: 'DRAFT',
        },
      });

      const response = await fetch(`${BASE_URL}/api/posts/bulk`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          posts: [
            { id: postId, data: { status: 'PUBLISHED' } },
            { id: post2.id, data: { status: 'PUBLISHED' } },
          ],
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.posts.length).toBe(2);
    });

    it('should bulk delete posts', async () => {
      const post3 = await prisma.post.create({
        data: {
          title: 'Post 3',
          content: 'Content 3',
          slug: 'post-3',
          authorId: userId,
          status: 'DRAFT',
        },
      });

      const response = await fetch(`${BASE_URL}/api/posts/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          postIds: [post3.id],
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.count).toBe(1);
    });
  });
});
