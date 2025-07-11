import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import * as adminController from '../controllers/adminController';
import * as programController from '../controllers/programController';

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
  .get('/users', adminController.getAllUsers)
  
  // Program management routes
  .get('/programs', programController.getAllPrograms)
  .get('/programs/:id', programController.getAdminProgramById)
  .post('/programs', programController.createProgram)
  .put('/programs/:id', programController.updateProgram)
  .delete('/programs/:id', programController.deleteProgram)
  
  // Toolkit management routes
  .post('/programs/:id/toolkit', programController.addToolToProgram)
  .delete('/programs/:programId/toolkit/:toolId', programController.removeToolFromProgram)
  
  // Facts management routes
  .post('/programs/:id/facts', programController.addFactToProgram)
  .delete('/programs/:programId/facts/:factId', programController.removeFactFromProgram);

export default adminRoutes; 