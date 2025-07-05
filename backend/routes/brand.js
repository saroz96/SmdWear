const express = require('express');
const Brand = require('../models/Brand');
const passport = require('passport');
const router = express.Router();
const Product = require('../models/Product');

const { uploadBrandImage, deleteBrandImage } = require('../middlewares/brandUploadMiddleware');


// Create new brand with image upload
router.post('/brands/new', uploadBrandImage.single('image'), async (req, res) => {
    const { name, description } = req.body;

    // Validation
    if (!name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Brand image is required' });
    }

    try {
        // Check if brand exists
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        // Create new brand with Cloudinary response
        const brand = new Brand({
            name,
            description,
            image: {
                public_id: req.file.filename, // Cloudinary public_id
                url: req.file.path // Cloudinary secure_url
            },
        });

        await brand.save();

        res.status(201).json({
            message: 'Brand created successfully',
            brand: {
                _id: brand._id,
                name: brand.name,
                description: brand.description,
                image: brand.image.url,
                createdAt: brand.createdAt
            }
        });
    } catch (err) {
        console.error(err);
        // Delete the uploaded image if brand creation fails
        if (req.file && req.file.filename) {
            await deleteBrandImage(req.file.filename);
        }
        res.status(500).json({
            message: 'Error creating brand',
            error: err.message
        });
    }
});

// Get all products for owner
router.get('/brands/get/all', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.json(brands);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching brands',
            error: err.message
        });
    }
});

// Get all brands for visitors
router.get('/brands/view/all', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.json(brands);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching brands',
            error: err.message
        });
    }
});

// Get all brands
router.get('/brands', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//view brands
router.get('/brands/product/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)

        if (!brand) {
            return res.status(404).json({ message: 'Product Brand not found' });
        }

        res.json({
            _id: brand._id,
            name: brand.name,
            description: brand.description,
            image: brand.image,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get products by brand
router.get('/products/brand/:brandId', async (req, res) => {
    try {
        const products = await Product.find({ brand: req.params.brandId })
            .select('name price image')
            .limit(12);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update brand with optional image update
router.put('/brands/edit/:id', uploadBrandImage.single('image'), async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        let image = brand.image;

        // If new image is uploaded
        if (req.file) {
            // Delete old image if it exists
            if (brand.image && brand.image.public_id) {
                await deleteImage(brand.image.public_id);
            }

            // Use the same format as your POST route
            image = {
                public_id: req.file.filename,  // Changed to match your POST route
                url: req.file.path            // Changed to match your POST route
            };
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                image: image || brand.image, // Fallback to existing image if none provided
                updatedAt: Date.now()
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: 'Brand updated successfully',
            brand: {
                _id: updatedBrand._id,
                name: updatedBrand.name,
                description: updatedBrand.description,
                image: updatedBrand.image.url,
                updatedAt: updatedBrand.updatedAt
            }
        });

    } catch (err) {
        console.error(err);

        // Clean up uploaded file if error occurred after upload
        if (req.file && req.file.filename) {
            await deleteImage(req.file.filename);
        }

        res.status(500).json({
            message: 'Error updating brand',
            error: err.message
        });
    }
});


// Delete product with image cleanup
router.delete('/brands/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        // Delete image from Cloudinary
        await deleteBrandImage(brand.image.public_id);

        await Brand.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Brand deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting brand',
            error: err.message
        });
    }
});


// Protected route example
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user
    });
});

module.exports = router;