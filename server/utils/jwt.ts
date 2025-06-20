import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || 'reset-token-secret-for-development';

// Define types for our JWT payloads
interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

interface ResetTokenPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const generateResetToken = (userId: string) => {
  return jwt.sign({ userId }, RESET_TOKEN_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const verifyResetToken = (token: string): ResetTokenPayload => {
  try {
    return jwt.verify(token, RESET_TOKEN_SECRET) as ResetTokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
};
