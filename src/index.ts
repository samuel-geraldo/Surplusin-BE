import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
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

app.get('/api/docs.json', (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.get(['/api/docs', '/api/docs/'], (req: Request, res: Response) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Surplusin API Docs</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/api/docs.json',
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: 'StandaloneLayout'
            });
          };
        </script>
      </body>
    </html>
  `);
});

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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
