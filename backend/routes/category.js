const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

const { uploadCategoryImage, deleteCategoryImage } = require('../middlewares/categoryUploadMiddleware');



// Create new brand with image upload
router.post('/categories/new', uploadCategoryImage.single('image'), async (req, res) => {
    const { name, brand, description } = req.body;

    // Validation
    if (!name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Brand image is required' });
    }

    try {
        // Check if brand exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create new brand with Cloudinary response
        const category = new Category({
            name,
            brand: brand || null, // Handle empty brand selection
            description,
            image: {
                public_id: req.file.filename, // Cloudinary public_id
                url: req.file.path // Cloudinary secure_url
            },
        });

        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category: {
                _id: category._id,
                name: category.name,
                brand: category.brand,
                description: category.description,
                image: category.image.url,
                createdAt: category.createdAt
            }
        });
    } catch (err) {
        console.error(err);
        // Delete the uploaded image if category creation fails
        if (req.file && req.file.filename) {
            await deleteCategoryImage(req.file.filename);
        }
        res.status(500).json({
            message: 'Error creating category',
            error: err.message
        });
    }
});


// Get all categories for owner
router.get('/categories/get/all', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching categories',
            error: err.message
        });
    }
});


// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all categories for visitors
router.get('/categories/view/all', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching categories',
            error: err.message
        });
    }
});


// Delete product with image cleanup
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete image from Cloudinary
        await deleteCategoryImage(category.image.public_id);

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Category deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting category',
            error: err.message
        });
    }
});

module.exports = router;