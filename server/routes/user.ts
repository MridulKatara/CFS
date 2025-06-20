import { Elysia } from 'elysia';
import { getProfile, updateProfile, updatePassword, getMyPrograms } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { createOrder, verifyPayment } from '../controllers/paymentController';

const userRoutes = new Elysia({ prefix: '/user' })
  .use(authMiddleware)
  .get('/profile', getProfile)
  .put('/profile', updateProfile)
  .put('/password', updatePassword)
  .get('/my-programs', getMyPrograms)
  .post('/payment/order', createOrder)
  .post('/payment/verify', verifyPayment);

export default userRoutes;


