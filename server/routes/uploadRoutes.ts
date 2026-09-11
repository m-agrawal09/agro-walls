import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadBufferToCloudinary } from '../config/cloudinary';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/upload
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // Direct Cloudinary Upload
      const result = await uploadBufferToCloudinary(req.file.buffer, 'reconnect_reports');
      return res.json({
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        source: 'cloudinary',
      });
    } else {
      // Fallback base64 data URI if cloud_name is awaiting configuration
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({
        url: base64Image,
        publicId: `local-${Date.now()}`,
        filename: req.file.originalname,
        source: 'local_fallback',
        notice: 'Set CLOUDINARY_CLOUD_NAME in .env to persist directly to Cloudinary storage',
      });
    }
  } catch (error: any) {
    console.error('[Upload Error]:', error);
    res.status(500).json({ error: error.message || 'Image upload failed' });
  }
});

export default router;
