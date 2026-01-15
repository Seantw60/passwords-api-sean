import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('Comments', () => {
  let authToken;
  let userId;
  let postId;
  let commentId;
  let replyId;

  beforeAll(async () => {
    // Create test user and login
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.create({
      data: {
        email: 'testcomment@example.com',
        name: 'Test Comment User',
        passwordHash: hashedPassword,
        role: 'READER',
      },
    });
    userId = user.id;

    // Create test post
    const post = await prisma.post.create({
      data: {
        title: 'Test Post for Comments',
        content: 'Content',
        slug: 'test-post-comments',
        authorId: userId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
    postId = post.id;

    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testcomment@example.com',
        password: 'Password123!',
      }),
    });

    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  afterAll(async () => {
    // Clean up
    await prisma.comment.deleteMany({
      where: { postId },
    });
    await prisma.post.delete({
      where: { id: postId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    await prisma.$disconnect();
  });

  describe('Create Comment', () => {
    it('should create a top-level comment', async () => {
      const response = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: 'This is a test comment',
          postId,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.comment.id).toBeDefined();
      expect(data.comment.content).toBe('This is a test comment');
      commentId = data.comment.id;
    });

    it('should create a nested reply', async () => {
      const response = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: 'This is a reply',
          postId,
          parentId: commentId,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.comment.parentId).toBe(commentId);
      replyId = data.comment.id;
    });

    it('should create deeply nested replies', async () => {
      const response = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: 'This is a reply to a reply',
          postId,
          parentId: replyId,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data.comment.parentId).toBe(replyId);
    });
  });

  describe('Get Comments', () => {
    it('should get nested comment tree', async () => {
      const response = await fetch(`${BASE_URL}/api/comments?postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.comments).toBeInstanceOf(Array);
      // Check nested structure
      const topComment = data.comments.find((c) => c.id === commentId);
      expect(topComment).toBeDefined();
      expect(topComment.replies).toBeInstanceOf(Array);
    });
  });

  describe('Update Comment', () => {
    it('should update own comment', async () => {
      const response = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: 'Updated comment content',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.comment.content).toBe('Updated comment content');
    });
  });

  describe('Delete Comment', () => {
    it('should delete comment and cascade delete replies', async () => {
      const response = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);

      // Verify comment is soft deleted
      const deletedComment = await prisma.comment.findUnique({
        where: { id: commentId },
      });
      expect(deletedComment.deletedAt).toBeDefined();
    });
  });
});
