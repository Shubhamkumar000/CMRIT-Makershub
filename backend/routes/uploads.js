import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed'));
  }
});

const uploadToCloudinary = (buffer, mimeType, folder) => {
  return new Promise((resolve, reject) => {
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

router.post('/event-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary is not configured on server' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'cmrit-makerspace/events');

    return res.status(201).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Event image upload error:', error);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
});

export default router;
