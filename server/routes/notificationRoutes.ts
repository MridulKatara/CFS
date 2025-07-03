import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import * as notificationController from '../controllers/notificationController';

const notificationRoutes = new Elysia({ prefix: '/notifications' })
  // User routes
  .use(authMiddleware)
  .post('/token', notificationController.saveNotificationToken)
  .get('/', notificationController.getUserNotifications)
  .put('/:id/read', notificationController.markNotificationAsRead)
  
  // Admin routes - add admin middleware here
  .post('/send', notificationController.sendNotification);

export default notificationRoutes;
