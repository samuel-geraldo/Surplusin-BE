import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './schemas/swagger.js';
import appRoutes from './routes/index.js';

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', appRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error tertangkap di Global Handler:', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    error: message,
    // (Opsional) Tampilkan stack trace hanya saat development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
