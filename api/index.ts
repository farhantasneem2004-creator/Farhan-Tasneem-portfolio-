import express, { Request, Response } from 'express';
import path from 'path';
import apiRouter from '../server/api.js';

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Cache-control headers on API responses to guarantee dynamic freshness
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve static uploads or images if requested via the API lambda
const staticCacheOptions = {
  setHeaders: (res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
};

const uploadsPath = path.join(process.cwd(), 'uploads');
const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads');
const publicPath = path.join(process.cwd(), 'public');

app.use('/uploads', express.static(uploadsPath, staticCacheOptions));
app.use('/uploads', express.static(publicUploadsPath, staticCacheOptions));
app.use('/images', express.static(path.join(publicPath, 'images'), staticCacheOptions));

// Health checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Farhan Tasneem Portfolio API' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', name: 'Farhan Tasneem Portfolio API' });
});

// Mount router at both /api and root / so any URL structure in Vercel rewrites works cleanly
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
