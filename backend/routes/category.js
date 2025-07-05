const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

const { uploadCategoryImage, deleteCategoryImage } = require('../middlewares/categoryUploadMiddleware');
const Product = require('../models/Product');



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

//view category
router.get('/categories/view/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({ message: 'Product category not found' });
        }

        res.json({
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get products by category
router.get('/products/categories/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId })
            .select('name price image')
            .limit(12);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get brands for get edit page
router.get('/categories/edit/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({
            _id: category._id,
            name: category.name,
            brand: category.brand || '',
            description: category.description,
            image: category.image,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching brand',
            error: err.message
        });
    }
});


// Update brand with optional image update
router.put('/categories/edit/:id', uploadCategoryImage.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const { name, description, brand } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ message: 'Name required' });
        }

        let image = category.image;

        // If new image is uploaded
        if (req.file) {
            // Delete old image if it exists
            if (category.image && category.image.public_id) {
                await deleteCategoryImage(category.image.public_id);
            }

            // Use the same format as your POST route
            image = {
                public_id: req.file.filename,  // Changed to match your POST route
                url: req.file.path            // Changed to match your POST route
            };
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                brand,
                image: image || category.image, // Fallback to existing image if none provided
                updatedAt: Date.now()
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: 'Brand updated successfully',
            category: {
                _id: updatedCategory._id,
                name: updatedCategory.name,
                brand: updatedCategory.brand,
                description: updatedCategory.description,
                image: updatedCategory.image.url,
                updatedAt: updatedCategory.updatedAt
            }
        });

    } catch (err) {
        console.error(err);
        // Clean up uploaded file if error occurred after upload
        if (req.file && req.file.filename) {
            await deleteCategoryImage(req.file.filename);
        }

        res.status(500).json({
            message: 'Error updating category',
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