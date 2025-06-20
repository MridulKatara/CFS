import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import programRoutes from './routes/programRoutes'
import userRoutes from './routes/user'

// Connect to MongoDB
connectDB()

const app = new Elysia()
.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Type', 'Authorization'],
}))
  .use(authRoutes)
  .use(programRoutes)
  .use(userRoutes)
  .get('/health', () => 'Healthy')
  .get('/test', () => ({ message: 'Test endpoint working' }))
  .listen(7001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);