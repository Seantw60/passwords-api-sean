import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');

// User schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

// Post schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const updatePostSchema = createPostSchema.partial();

export const bulkUpdatePostsSchema = z.object({
  postIds: z.array(z.string()).min(1, 'At least one post ID is required'),
  updates: updatePostSchema,
});

export const bulkDeletePostsSchema = z.object({
  postIds: z.array(z.string()).min(1, 'At least one post ID is required'),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(5000, 'Comment is too long'),
  postId: z.string().min(1, 'Post ID is required'),
  parentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(5000, 'Comment is too long'),
});

// Search schema
export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  type: z.enum(['all', 'posts', 'comments', 'users']).optional().default('all'),
  author: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
