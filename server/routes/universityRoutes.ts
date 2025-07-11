import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import * as universityController from '../controllers/universityController';

// Admin middleware to check if user is an admin
const adminMiddleware = new Elysia()
  .use(authMiddleware)
  .derive(({ user }) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    return {};
  });

const universityRoutes = new Elysia({ prefix: '/api/universities' })
  // Public route to get all universities (for registration)
  .get('/', universityController.getAllUniversities)
  
  // Admin routes protected by middleware
  .use(adminMiddleware)
  .post('/', universityController.addUniversity)
  .put('/:id', universityController.updateUniversity)
  .delete('/:id', universityController.deleteUniversity);

export default universityRoutes; 