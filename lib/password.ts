import bcrypt from "bcrypt";
import { prisma } from "./prisma.js";

// Constants
const SALT_ROUNDS = 12;
const PASSWORD_HISTORY_LIMIT = 5;
const MIN_PASSWORD_LENGTH = 8 ;
const MAX_PASSWORD_LENGTH = 72 ;

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialCharacters: boolean;
}

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: MIN_PASSWORD_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialCharacters: true,
};  
export function validatePasswordStrength(
  password: string,
  requirements: PasswordRequirements = DEFAULT_REQUIREMENTS
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters`)
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(`Password must not exceed ${MAX_PASSWORD_LENGTH} characters`)
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (requirements.requireSpecialCharacters && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return { valid: errors.length === 0, errors }

  /**
 * Hashes a password using bcrypt with 12 salt rounds
 * 
 * @param password - Plain text password to hash
 * @returns Promise resolving to bcrypt hash
 * @throws Error if password is invalid or hashing fails
 */

export async function hashPassword(password: string): Promise<string> {
  // Validate password length before hashing
  if (!password || password.length === 0) {
    throw new Error('Password cannot be empty')
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`)
  }
  
  try {
    // Generate salt and hash in one operation (recommended approach)
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    return hash
  } catch (error) {
    throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verifies a password against a bcrypt hash using constant-time comparison
 * 
 * @param password - Plain text password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 */

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function savePasswordHistory(userId: number, passwordHash: string) {
  await prisma.passwordHistory.create({
    data: {
      userId,
      passwordHash,
    },
  });

  // Clean up old passwords (keep only last PASSWORD_HISTORY_LIMIT)
  const allPasswords = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (allPasswords.length > PASSWORD_HISTORY_LIMIT) {
    const toDelete = allPasswords.slice(PASSWORD_HISTORY_LIMIT);
    await prisma.passwordHistory.deleteMany({
      where: {
        id: { in: toDelete.map((p) => p.id) },
      },
    });
  }
}
