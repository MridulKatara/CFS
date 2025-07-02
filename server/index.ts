import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import programRoutes from './routes/programRoutes'
import allProgramRoutes from './routes/allProgramsRoutes'
import userRoutes from './routes/user'

// Connect to MongoDB
connectDB()

const app = new Elysia()
.use(cors({
  origin: (request) => {
    const origin = request.headers.get('origin');
    return origin ? true : false;
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposeHeaders: ['Content-Type', 'Authorization'],
}))
  .use(authRoutes)
  .use(programRoutes)
  .use(allProgramRoutes)
  .use(userRoutes)
  .use(programRoutes)
  .get('/health', () => 'Healthy')
  .get('/test', () => ({ message: 'Test endpoint working' }))
  .listen(7001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
