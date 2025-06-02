import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Process images
export const processImages = async (files) => {
  if (!files || !Array.isArray(files)) {
    throw new Error('Invalid files array');
  }

  const processedImages = [];
  const errors = [];
  
  for (const file of files) {
    try {
      if (!file.path) {
        throw new Error('Invalid file object');
      }

      // Return the path relative to the uploads directory
      const relativePath = path.relative(uploadsDir, file.path);
      processedImages.push(`/uploads/${relativePath}`);
    } catch (error) {
      console.error('Error processing image:', error);
      errors.push(error.message);
      
      // Clean up the file if it exists
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  // If all images failed to process, throw an error
  if (processedImages.length === 0 && errors.length > 0) {
    throw new Error('Failed to process any images: ' + errors.join(', '));
  }
  
  return processedImages;
}; 