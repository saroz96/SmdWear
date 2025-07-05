
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
        folder: 'SurgimedSlider',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const uploadSliderImage = multer({ storage });

// Utility functions
const deleteSliderImage = async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
};

module.exports = {
    uploadSliderImage,
    deleteSliderImage,
    cloudinary
};