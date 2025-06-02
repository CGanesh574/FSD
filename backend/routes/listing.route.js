import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from '../controllers/listing.controller.js';
import { upload } from '../utils/imageUpload.js';

const router = express.Router();

// Upload images route
router.post('/upload', verifyToken, upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    // Process the uploaded files
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    return res.status(200).json({
      success: true,
      data: {
        imageUrls
      }
    });
  } catch (error) {
    console.error('Error in upload route:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error uploading images'
    });
  }
});

// Create listing route with file upload
router.post('/create', verifyToken, upload.array('images', 6), createListing);

// Other routes
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;
