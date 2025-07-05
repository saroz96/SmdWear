
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SurgimedBrands',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const uploadBrandImage = multer({ storage });

// Utility functions
const deleteBrandImage = async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
};

module.exports = {
    uploadBrandImage,
    deleteBrandImage,
    cloudinary
};