import { Elysia } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import * as notificationController from '../controllers/notificationController';

const notificationRoutes = new Elysia({ prefix: '/notifications' })
  // User routes
  .use(authMiddleware)
  .post('/token', notificationController.saveNotificationToken)
  .get('/', notificationController.getUserNotifications)
  .put('/:id/read', notificationController.markNotificationAsRead)
  .get('/unread/count', notificationController.getUnreadNotificationCount)
  .put('/mark-all-read', notificationController.markAllNotificationsAsRead)
  
  // Admin routes - add admin middleware here
  .post('/send', notificationController.sendNotification)
  .get('/recent', notificationController.getRecentNotifications);

export default notificationRoutes;
