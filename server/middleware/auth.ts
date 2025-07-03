import { Elysia } from 'elysia';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ request }) => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    const decoded = verifyToken(token) as { userId: string; role: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  });

// Export auth as an alias for authMiddleware for backward compatibility
export const auth = authMiddleware;

// export const isAdmin = new Elysia()
//   .derive(({ user }: AuthContext) => {
//     if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
//       throw new Error('Unauthorized: Admin access required');
//     }
//     return { user };
//   });

// export const isSuperAdmin = new Elysia()
//   .derive(({ user }: AuthContext) => {
//     if (!user || user.role !== 'super-admin') {
//       throw new Error('Unauthorized: Super Admin access required');
//     }
//     return { user };
//   });
