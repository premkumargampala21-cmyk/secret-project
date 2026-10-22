import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const SHARED_PASSWORD = process.env.SHARED_PASSWORD || 'bangaram23';
const SESSION_SECRET = process.env.SESSION_SECRET || 'bangaram_romantic_secret_forever_2026';

// Middleware for large photo uploads (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Local Paths (used for static music/assets and local fallback)
const DATA_DIR = path.resolve(process.cwd(), 'data');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const UPLOADS_PHOTOS_DIR = path.join(UPLOADS_DIR, 'photos');

// Ensure local directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_PHOTOS_DIR)) {
  fs.mkdirSync(UPLOADS_PHOTOS_DIR, { recursive: true });
}
if (!fs.existsSync(PHOTOS_FILE)) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Serve public static assets (e.g. /music/sakhiye.mp3) and local upload fallback
app.use(express.static(path.resolve(process.cwd(), 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// ---------------------------------------------------------
// 1. Cloudinary Persistent Image Storage Configuration
// ---------------------------------------------------------
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

const isCloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log(`☁️ [Storage] Cloudinary persistent photo storage initialized (Cloud: ${CLOUDINARY_CLOUD_NAME}).`);
} else {
  console.warn(
    '⚠️ [Storage] Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not detected. Using local filesystem storage as a temporary fallback. NOTE: Local disk is ephemeral on Render Free and resets on container restart.'
  );
}

// ---------------------------------------------------------
// 2. Persistent Database Configuration (PostgreSQL)
// ---------------------------------------------------------
const DATABASE_URL = (process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim();
let dbPool: Pool | null = null;

if (DATABASE_URL) {
  const isLocalhost = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
  dbPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  });
  console.log('🐘 [Database] PostgreSQL pool initialized for permanent metadata persistence.');
} else {
  console.warn(
    '⚠️ [Database] DATABASE_URL not set. Running in local file fallback mode (data/photos.json). Notice: On Render Free, container disks are ephemeral. Configure DATABASE_URL (e.g., from Neon.tech) for permanent metadata persistence across restarts.'
  );
}

export interface PhotoRecord {
  id: string;
  url: string;
  public_id?: string;
  caption: string;
  date?: string;
  timestamp: number;
  isCustom: boolean;
}

// Helper: Read and Write Local JSON Fallback
function readLocalPhotos(): PhotoRecord[] {
  try {
    if (fs.existsSync(PHOTOS_FILE)) {
      const raw = fs.readFileSync(PHOTOS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((p) => ({
          id: String(p.id),
          url: String(p.url || ''),
          public_id: p.public_id ? String(p.public_id) : undefined,
          caption: String(p.caption || ''),
          date: String(p.date || ''),
          timestamp: Number(p.timestamp) || Date.now(),
          isCustom: p.isCustom !== false,
        }));
      }
    }
  } catch (err) {
    console.error('Error reading local photos.json:', err);
  }
  return [];
}

function writeLocalPhotos(photos: PhotoRecord[]) {
  try {
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local photos.json:', err);
  }
}

// Database Initialization & Automatic Seeding
async function initDatabase(): Promise<void> {
  if (!dbPool) return;

  try {
    const client = await dbPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS photos (
          id VARCHAR(255) PRIMARY KEY,
          url TEXT NOT NULL,
          public_id VARCHAR(255),
          caption TEXT,
          date VARCHAR(255),
          timestamp BIGINT NOT NULL,
          is_custom BOOLEAN DEFAULT TRUE
        );
      `);

      // Check if table is empty, seed with initial default memories
      const countRes = await client.query('SELECT COUNT(*) AS total FROM photos;');
      const total = parseInt(countRes.rows[0]?.total || '0', 10);
      if (total === 0) {
        console.log('📦 [Database] Seeding PostgreSQL with initial memories from data/photos.json...');
        const initial = readLocalPhotos();
        for (const p of initial) {
          await client.query(
            `INSERT INTO photos (id, url, public_id, caption, date, timestamp, is_custom)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING;`,
            [
              p.id,
              p.url,
              p.public_id || null,
              p.caption,
              p.date || null,
              p.timestamp,
              p.isCustom,
            ]
          );
        }
        console.log(`✅ [Database] Seeded ${initial.length} initial memories successfully.`);
      }
      console.log('✅ [Database] PostgreSQL connected and initialized successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ [Database] Failed to connect/initialize PostgreSQL. Falling back to local data/photos.json:', err);
    dbPool = null;
  }
}

// Data Access Layer: Photos
async function getAllPhotos(): Promise<PhotoRecord[]> {
  if (dbPool) {
    try {
      const res = await dbPool.query(
        'SELECT id, url, public_id, caption, date, timestamp, is_custom FROM photos ORDER BY timestamp DESC;'
      );
      return res.rows.map((r) => ({
        id: r.id,
        url: r.url,
        public_id: r.public_id || undefined,
        caption: r.caption || '',
        date: r.date || '',
        timestamp: Number(r.timestamp),
        isCustom: Boolean(r.is_custom),
      }));
    } catch (err) {
      console.error('Database query error in getAllPhotos, falling back to local file:', err);
    }
  }
  return readLocalPhotos();
}

async function insertPhoto(photo: PhotoRecord): Promise<void> {
  if (dbPool) {
    try {
      await dbPool.query(
        `INSERT INTO photos (id, url, public_id, caption, date, timestamp, is_custom)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          photo.id,
          photo.url,
          photo.public_id || null,
          photo.caption,
          photo.date || null,
          photo.timestamp,
          photo.isCustom,
        ]
      );
      return;
    } catch (err) {
      console.error('Database query error in insertPhoto, writing to local file:', err);
    }
  }
  const current = readLocalPhotos();
  writeLocalPhotos([photo, ...current]);
}

async function removePhoto(id: string): Promise<PhotoRecord | null> {
  if (dbPool) {
    try {
      const res = await dbPool.query(
        'DELETE FROM photos WHERE id = $1 RETURNING id, url, public_id, caption, date, timestamp, is_custom;',
        [id]
      );
      if (res.rowCount && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          url: r.url,
          public_id: r.public_id || undefined,
          caption: r.caption || '',
          date: r.date || '',
          timestamp: Number(r.timestamp),
          isCustom: Boolean(r.is_custom),
        };
      }
      return null;
    } catch (err) {
      console.error('Database query error in removePhoto, falling back to local file:', err);
    }
  }
  const current = readLocalPhotos();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const [removed] = current.splice(index, 1);
  writeLocalPhotos(current);
  return removed;
}

async function updatePhotoMetadata(
  id: string,
  updates: { caption?: string; date?: string }
): Promise<PhotoRecord | null> {
  if (dbPool) {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (updates.caption !== undefined) {
        fields.push(`caption = $${idx++}`);
        values.push(updates.caption);
      }
      if (updates.date !== undefined) {
        fields.push(`date = $${idx++}`);
        values.push(updates.date);
      }

      if (fields.length === 0) {
        const res = await dbPool.query('SELECT * FROM photos WHERE id = $1;', [id]);
        if (!res.rows.length) return null;
        const r = res.rows[0];
        return {
          id: r.id,
          url: r.url,
          public_id: r.public_id || undefined,
          caption: r.caption || '',
          date: r.date || '',
          timestamp: Number(r.timestamp),
          isCustom: Boolean(r.is_custom),
        };
      }

      values.push(id);
      const res = await dbPool.query(
        `UPDATE photos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, url, public_id, caption, date, timestamp, is_custom;`,
        values
      );
      if (res.rowCount && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          url: r.url,
          public_id: r.public_id || undefined,
          caption: r.caption || '',
          date: r.date || '',
          timestamp: Number(r.timestamp),
          isCustom: Boolean(r.is_custom),
        };
      }
      return null;
    } catch (err) {
      console.error('Database query error in updatePhotoMetadata, falling back to local file:', err);
    }
  }
  const current = readLocalPhotos();
  const target = current.find((p) => p.id === id);
  if (!target) return null;
  if (updates.caption !== undefined) target.caption = updates.caption;
  if (updates.date !== undefined) target.date = updates.date;
  writeLocalPhotos(current);
  return target;
}

// ---------------------------------------------------------
// 3. Helper: Token Generation & Verification
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// 4. API Authentication Routes
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// 5. Photo Gallery API Routes (Cloudinary + Persistent DB)
// ---------------------------------------------------------
app.get('/api/photos', requireAuth, async (_req: Request, res: Response) => {
  try {
    const photos = await getAllPhotos();
    res.json({ success: true, photos });
  } catch (err) {
    console.error('Error reading photos:', err);
    res.status(500).json({ error: 'Failed to load photos' });
  }
});

app.post('/api/photos', requireAuth, async (req: Request, res: Response) => {
  const { imageBase64, caption, date } = req.body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'Image data is required' });
    return;
  }

  // Validate format and mime type
  const matches = imageBase64.match(/^data:([A-Za-z0-9\-+/]+);base64,(.+)$/);
  let base64Data = imageBase64;
  let mimeType = 'image/jpeg';
  let ext = 'jpg';

  if (matches && matches.length === 3) {
    mimeType = matches[1].toLowerCase();
    base64Data = matches[2];
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else {
      res.status(400).json({
        error: 'Unsupported image type. Please upload a JPG, PNG, WebP, or GIF image ❤️',
      });
      return;
    }
  }

  // Validate base64 buffer and size (max 20MB)
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length === 0) {
      res.status(400).json({ error: 'Image data is empty' });
      return;
    }
    if (buffer.length > 20 * 1024 * 1024) {
      res.status(400).json({ error: 'Image is too large. Maximum allowed size is 20MB.' });
      return;
    }
  } catch {
    res.status(400).json({ error: 'Invalid base64 image data' });
    return;
  }

  try {
    let photoUrl = '';
    let publicId: string | undefined = undefined;

    if (isCloudinaryConfigured) {
      // Secure Cloudinary Upload from backend
      const dataUri = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:${mimeType};base64,${base64Data}`;

      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: 'birthday_memories',
        resource_type: 'image',
      });

      photoUrl = uploadResponse.secure_url;
      publicId = uploadResponse.public_id;
    } else {
      // Temporary local filesystem fallback
      const filename = `memory_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
      const filePath = path.join(UPLOADS_PHOTOS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      photoUrl = `/uploads/photos/${filename}`;
    }

    const newPhoto: PhotoRecord = {
      id: `photo_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      url: photoUrl,
      public_id: publicId,
      caption: typeof caption === 'string' && caption.trim()
        ? caption.trim()
        : 'Our special memory together ❤️',
      date: typeof date === 'string' && date.trim()
        ? date.trim()
        : 'Precious Memory',
      timestamp: Date.now(),
      isCustom: true,
    };

    await insertPhoto(newPhoto);

    res.json({ success: true, photo: newPhoto });
  } catch (err: unknown) {
    const errorObj = err as Error;
    console.error('Error saving photo:', errorObj);
    res.status(500).json({
      error: 'Failed to upload photo',
      message: errorObj?.message || 'Server error uploading image',
    });
  }
});

app.delete('/api/photos/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPhoto = await removePhoto(id);

    if (!deletedPhoto) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    // If Cloudinary public_id exists, delete remote asset from Cloudinary
    if (deletedPhoto.public_id && isCloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(deletedPhoto.public_id);
      } catch (cloudErr) {
        console.error('Failed to delete image from Cloudinary:', cloudErr);
      }
    }

    // If legacy local file exists, remove from disk
    if (deletedPhoto.url && deletedPhoto.url.startsWith('/uploads/photos/')) {
      const filename = path.basename(deletedPhoto.url);
      const filePath = path.join(UPLOADS_PHOTOS_DIR, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Error removing local file:', e);
        }
      }
    }

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (err) {
    console.error('Error deleting photo:', err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

app.patch('/api/photos/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { caption, date } = req.body;

  try {
    const updates: { caption?: string; date?: string } = {};
    if (typeof caption === 'string') updates.caption = caption.trim();
    if (typeof date === 'string') updates.date = date.trim();

    const updated = await updatePhotoMetadata(id, updates);
    if (!updated) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    res.json({ success: true, photo: updated });
  } catch (err) {
    console.error('Error updating photo:', err);
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

// ---------------------------------------------------------
// 6. Setup Vite (Dev) or Static File Serving (Prod)
// ---------------------------------------------------------
async function startServer() {
  await initDatabase();

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
    console.log(`❤️ Romantic Birthday Website running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
