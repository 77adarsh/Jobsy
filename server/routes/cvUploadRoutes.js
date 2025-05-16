import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import verifyToken from '../middlewares/verifyToken.js';
import { uploadCV, getCVInfo, deleteCV } from '../controllers/cvUploadController.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/cvs';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `cv-${req.user.id}-${uniqueSuffix}${fileExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, DOC, and DOCX allowed'), false);
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Routes
router.post('/cv', verifyToken, upload.single('cv'), uploadCV);
router.get('/cv/:userId', verifyToken, getCVInfo);
router.delete('/cv/:userId', verifyToken, deleteCV);

export default router;