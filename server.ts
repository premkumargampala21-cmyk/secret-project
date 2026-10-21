import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const SHARED_PASSWORD = process.env.SHARED_PASSWORD || 'bangaram23';
const SESSION_SECRET = process.env.SESSION_SECRET || 'bangaram_romantic_secret_forever_2026';

// Middleware for large photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Paths
const DATA_DIR = path.resolve(process.cwd(), 'data');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const UPLOADS_PHOTOS_DIR = path.join(UPLOADS_DIR, 'photos');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_PHOTOS_DIR)) {
  fs.mkdirSync(UPLOADS_PHOTOS_DIR, { recursive: true });
}
if (!fs.existsSync(PHOTOS_FILE)) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Serve public assets (e.g. /music/sakhiye.mp3) and uploaded photos statically
app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Token Generation & Verification
function generateToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${timestamp}:${SHARED_PASSWORD}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max session age: 60 days
  const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > MAX_AGE_MS) return false;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${timestampStr}:${SHARED_PASSWORD}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(providedSignature),
    Buffer.from(expectedSignature)
  );
}

// Authentication Middleware
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.headers['x-auth-token'] as string | undefined);

  if (!verifyToken(token)) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Please enter our shared secret password to access this surprise ❤️',
    });
    return;
  }
  next();
}

// Helper: Read & Write Photos
function readPhotos() {
  try {
    const raw = fs.readFileSync(PHOTOS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writePhotos(photos: unknown[]) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), 'utf-8');
}

// API Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  // Compare password safely (case-insensitive and tolerant of loving variations)
  const cleanInput = password.trim().toLowerCase().replace(/\s+/g, '');
  const targetPassword = SHARED_PASSWORD.trim().toLowerCase().replace(/\s+/g, '');
  const validPasswords = [
    targetPassword,
    'sarni23',
    'sarni',
    'sarani',
    'saranilu',
    'saraniluuu',
    'saraniluuuu',
    'bangaram',
    'bangaram23',
    'january23',
    'jan23',
    '23',
  ];
  const isMatch = validPasswords.includes(cleanInput);

  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "Oops! That's not our secret password, Bangaram... try again with love! 🥺❤️",
    });
    return;
  }

  const token = generateToken();
  res.json({
    success: true,
    token,
    user: 'Bangaram ❤️',
    message: 'Welcome to your surprise, my love! 💗',
  });
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (req.headers['x-auth-token'] as string | undefined);

  if (verifyToken(token)) {
    res.json({ authenticated: true, user: 'Bangaram ❤️' });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Photo Gallery API
app.get('/api/photos', requireAuth, (_req: Request, res: Response) => {
  const photos = readPhotos();
  res.json({ success: true, photos });
});

app.post('/api/photos', requireAuth, (req: Request, res: Response) => {
  const { imageBase64, caption, date } = req.body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'Image data is required' });
    return;
  }

  try {
    // Extract base64 format and data
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('gif')) ext = 'gif';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const filename = `memory_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOADS_PHOTOS_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/photos/${filename}`;
    const newPhoto = {
      id: `photo_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      url: publicUrl,
      caption: caption || 'Our special memory together ❤️',
      date: date || 'Precious Memory',
      timestamp: Date.now(),
      isCustom: true,
    };

    const photos = readPhotos();
    const updated = [newPhoto, ...photos];
    writePhotos(updated);

    res.json({ success: true, photo: newPhoto });
  } catch (err) {
    console.error('Error saving photo:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

app.delete('/api/photos/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const photos = readPhotos();
  const targetIndex = photos.findIndex((p: { id: string }) => p.id === id);

  if (targetIndex === -1) {
    res.status(404).json({ error: 'Photo not found' });
    return;
  }

  const targetPhoto = photos[targetIndex];
  if (targetPhoto.url && targetPhoto.url.startsWith('/uploads/photos/')) {
    const filename = path.basename(targetPhoto.url);
    const filePath = path.join(UPLOADS_PHOTOS_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error removing file:', e);
      }
    }
  }

  photos.splice(targetIndex, 1);
  writePhotos(photos);
  res.json({ success: true, message: 'Photo deleted successfully' });
});

app.patch('/api/photos/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { caption, date } = req.body;
  const photos = readPhotos();
  const target = photos.find((p: { id: string }) => p.id === id);

  if (!target) {
    res.status(404).json({ error: 'Photo not found' });
    return;
  }

  if (typeof caption === 'string') target.caption = caption.trim();
  if (typeof date === 'string') target.date = date.trim();

  writePhotos(photos);
  res.json({ success: true, photo: target });
});

// Setup Vite or Static File Serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Romantic Birthday Website running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
