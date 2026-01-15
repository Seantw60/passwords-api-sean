import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const PASSWORD_RESET_EXPIRES_IN = '1h';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function generatePasswordResetToken(userId) {
  return jwt.sign({ userId, type: 'password-reset' }, JWT_SECRET, {
    expiresIn: PASSWORD_RESET_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type === 'password-reset') {
      return null; // This is a password reset token, not an auth token
    }
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function verifyPasswordResetToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type === 'password-reset' && decoded.userId) {
      return { userId: decoded.userId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function checkPasswordHistory(userId, newPassword) {
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5, // Check last 5 passwords
  });

  for (const entry of history) {
    const matches = await verifyPassword(newPassword, entry.passwordHash || entry.password);
    if (matches) {
      return true; // Password was used before
    }
  }

  return false; // Password is new
}

export async function savePasswordToHistory(userId, password) {
  await prisma.passwordHistory.create({
    data: {
      userId,
      passwordHash: await hashPassword(password),
    },
  });
}
