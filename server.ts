import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/api.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Static uploads directory (supports root uploads and public uploads fallback)
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));
  const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(publicUploadsPath));

  // Serve static assets from src/assets to guarantee backward compatibility
  const srcAssetsPath = path.join(process.cwd(), 'src', 'assets');
  app.use('/src/assets', express.static(srcAssetsPath));

  // Serve public static assets (images, fonts, portraits)
  const publicPath = path.join(process.cwd(), 'public');
  const staticCacheOptions = {
    setHeaders: (res: express.Response) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  };
  app.use(express.static(publicPath, staticCacheOptions));
  app.use('/images', express.static(path.join(publicPath, 'images'), staticCacheOptions));

  // Mount API routes FIRST
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Farhan Tasneem Portfolio API' });
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Ensure static assets within dist take precedence
    app.use(express.static(distPath, staticCacheOptions));
    app.use('/uploads', express.static(path.join(distPath, 'uploads'), staticCacheOptions));
    app.use('/images', express.static(path.join(distPath, 'images'), staticCacheOptions));
    app.use('/src/assets', express.static(path.join(distPath, 'src', 'assets'), staticCacheOptions));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
