import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import * as adminController from '../controllers/adminController';

// Admin middleware to check if user is an admin
const adminMiddleware = new Elysia()
  .use(authMiddleware)
  .derive(({ user }) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    return {};
  });

const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(adminMiddleware)
  .get('/users', adminController.getAllUsers);

export default adminRoutes; 