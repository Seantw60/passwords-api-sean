import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth.js";

/**
 * ✅ RBAC (Role-Based Access Control) Implementation - COMPLETE
 * By: Quil (Part E - Access Avengers)
 * 
 * This module provides:
 * - Permission-based access control
 * - Role-to-permission mapping
 * - Authentication middleware
 * - Authorization middleware
 * 
 * Roles:
 * - admin: Full access to all features
 * - editor: Can create/update/delete posts and comments
 * - reader: Can create/update/delete own posts and own comments
 */

/**
 * Permission types for the application
 */
const PERMISSIONS = {
  POSTS_CREATE: "posts:create",
  POSTS_READ: "posts:read",
  POSTS_UPDATE: "posts:update",
  POSTS_DELETE: "posts:delete",
  POSTS_BULK_UPDATE: "posts:bulk-update",
  POSTS_BULK_DELETE: "posts:bulk-delete",
  COMMENTS_CREATE: "comments:create",
  COMMENTS_READ: "comments:read",
  COMMENTS_UPDATE: "comments:update",
  COMMENTS_DELETE: "comments:delete",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  WELLNESS_READ: "wellness:read",
  WELLNESS_CREATE: "wellness:create",
  ADMIN_ACCESS: "admin:access",
};

/**
 * Role-based permissions mapping
 * Matches Prisma UserRole enum: admin, editor, reader (lowercase)
 */
const rolePermissions = {
  admin: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.POSTS_BULK_UPDATE,
    PERMISSIONS.POSTS_BULK_DELETE,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_READ,
    PERMISSIONS.COMMENTS_UPDATE,
    PERMISSIONS.COMMENTS_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.WELLNESS_READ,
    PERMISSIONS.WELLNESS_CREATE,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  editor: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.POSTS_BULK_UPDATE,
    PERMISSIONS.POSTS_BULK_DELETE,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_READ,
    PERMISSIONS.COMMENTS_UPDATE,
    PERMISSIONS.COMMENTS_DELETE,
    PERMISSIONS.WELLNESS_READ,
    PERMISSIONS.WELLNESS_CREATE,
  ],
  reader: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_READ,
    PERMISSIONS.COMMENTS_UPDATE,
    PERMISSIONS.COMMENTS_DELETE,
    PERMISSIONS.WELLNESS_READ,
    PERMISSIONS.WELLNESS_CREATE,
  ],
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role (admin, editor, reader)
 * @param {string} permission - Permission to check
 * @returns {boolean} true if role has permission
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Extract and verify JWT token from request
 * Supports Authorization header (Bearer token) and cookies
 * 
 * @param {NextRequest} request - Next.js request object
 * @returns {Object|NextResponse} User object if authenticated, error response if not
 */
export async function requireAuth(request) {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get("authorization");
  let tokenString = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    tokenString = authHeader.substring(7);
  } else {
    // Fallback to cookie
    const cookieToken = request.cookies.get("token");
    tokenString = cookieToken?.value || null;
  }

  if (!tokenString) {
    return NextResponse.json(
      { error: "Unauthorized - No token provided" },
      { status: 401 }
    );
  }

  // Verify token using our auth utility
  // Note: verifyToken is imported from lib/auth.js
  const decoded = verifyToken(tokenString);

  if (!decoded) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid or expired token" },
      { status: 401 }
    );
  }

  // Ensure role is valid (admin, editor, reader)
  if (!["admin", "editor", "reader"].includes(decoded.role)) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid role" },
      { status: 401 }
    );
  }

  return {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
  };
}

/**
 * Require authentication AND a specific permission
 * 
 * @param {NextRequest} request - Next.js request object
 * @param {string} permission - Required permission
 * @returns {Object|NextResponse} User object if authorized, error response if not
 * 
 * @example
 * // In an API route:
 * const authResult = await requirePermission(request, "posts:delete");
 * if (authResult instanceof NextResponse) {
 *   return authResult; // Unauthorized or forbidden
 * }
 * // User is authenticated and has permission
 * const user = authResult;
 */
export async function requirePermission(request, permission) {
  // First check authentication
  const authResult = await requireAuth(request);

  // If authentication failed, return the error response
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Check if user has the required permission
  if (!hasPermission(authResult.role, permission)) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: `You don't have permission to perform this action. Required: ${permission}`,
      },
      { status: 403 }
    );
  }

  return authResult;
}

/**
 * Get all permissions for a role (useful for documentation/debugging)
 * @param {string} role - User role
 * @returns {Array} Array of permissions for the role
 */
export function getRolePermissions(role) {
  return rolePermissions[role] || [];
}

/**
 * Check if user is admin
 * @param {string} role - User role
 * @returns {boolean} true if admin
 */
export function isAdmin(role) {
  return role === "admin";
}

/**
 * Check if user can modify a resource they own
 * Used for ownership-based authorization (e.g., users can edit their own posts)
 * @param {string} userRole - User's role
 * @param {string} resourceOwnerId - ID of the resource owner
 * @param {string} userId - Current user's ID
 * @returns {boolean} true if user can modify (is admin or owns the resource)
 */
export function canModifyOwnResource(userRole, resourceOwnerId, userId) {
  // Admins can modify any resource
  if (userRole === "admin") {
    return true;
  }
  // Users can modify their own resources
  return resourceOwnerId === userId;
}
