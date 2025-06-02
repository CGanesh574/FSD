import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import { processImages } from '../utils/imageUpload.js';

export const createListing = async (req, res, next) => {
  try {
    // Use imageUrls from body if present, otherwise process uploaded files
    let imageUrls = [];
    if (req.body.imageUrls && Array.isArray(req.body.imageUrls) && req.body.imageUrls.length > 0) {
      imageUrls = req.body.imageUrls;
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      try {
        imageUrls = await processImages(req.files);
      } catch (error) {
        return next(errorHandler(400, error.message));
      }
    }

    // Create listing with or without images
    const listing = await Listing.create({
      ...req.body,
      imageUrls,
      userRef: req.user.id,
    });

    return res.status(201).json({
      success: true,
      listing
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const { type, offer, sortBy, order } = req.query;
    const filter = {};

    // Filter by type (rent/sale)
    if (type && type !== 'all') {
      filter.type = type;
    }

    // Filter by offer
    if (offer === 'true') {
      filter.offer = true;
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sort = { createdAt: -1 }; // Default: most recent first
    }

    const listings = await Listing.find(filter).sort(sort);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}; 