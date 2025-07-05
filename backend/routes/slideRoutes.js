const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide');
const { uploadSliderImage, deleteSliderImage } = require('../middlewares/uploadSliderImage');
const { protect, admin } = require('../middlewares/authMiddleware');
const passport = require('passport');

// @desc    Get all slides
// @route   GET /api/slides
// @access  Public
router.get('/slides', async (req, res) => {
    try {
        const slides = await Slide.find({}).sort({ order: 1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a slide
// @route   POST /api/slides
// @access  Private/Admin
router.post('/admin/slider/new', protect, uploadSliderImage.single('image'), async (req, res) => {
    try {
        const { title, description, link, isActive } = req.body;

        const slide = new Slide({
            title,
            description,
            link,
            isActive: isActive || true,
            image: {
                url: req.file.path,
                public_id: req.file.filename
            }
        });

        const createdSlide = await slide.save();
        res.status(201).json(createdSlide);
    } catch (error) {
        await deleteSliderImage(req.file.filename);
        res.status(400).json({ message: error.message });
    }
});

// Get all categories for owner
router.get('/admin/slider/get/all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const slides = await Slide.find().sort({ createdAt: -1 });
        res.json(slides);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching slider',
            error: err.message
        });
    }
});


// @desc    Delete a slide
// @route   DELETE /api/slides/:id
// @access  Private/Admin
router.delete('/admin/slider/:id', protect, async (req, res) => {
    try {
        const slide = await Slide.findById(req.params.id);

        // Delete image from Cloudinary first
        await deleteSliderImage(slide.image.public_id);

        await Slide.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slide removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;