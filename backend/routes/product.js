const express = require('express');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { upload, deleteImage } = require('../middlewares/uploadMiddleware');
const User = require('../models/User');


// Create new product with image upload
router.post('/products/new', upload.single('image'), async (req, res) => {
    const { name, brand, category, shortDescription, longDescription } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Product image is required' });
    }

    try {
        // Check if product exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        // Create new product with Cloudinary response
        const product = new Product({
            name,
            brand: brand || null, // Handle empty brand selection
            category: category || null,
            shortDescription,
            longDescription,
            image: {
                public_id: req.file.filename, // Cloudinary public_id
                url: req.file.path // Cloudinary secure_url
            },
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product: {
                _id: product._id,
                name: product.name,
                brand: product.brand,
                category: product.category,
                shortDescription: product.shortDescription,
                longDescription: product.longDescription,
                image: product.image.url,
                createdAt: product.createdAt
            }
        });
    } catch (err) {
        console.error(err);
        // Delete the uploaded image if product creation fails
        if (req.file && req.file.filename) {
            await deleteImage(req.file.filename);
        }
        res.status(500).json({
            message: 'Error creating product',
            error: err.message
        });
    }
});


// Get all products for owner
router.get('/products/get/all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'category',
                select: 'name',  // Explicitly select name field
                model: 'Category' // Specify model if needed
            })
            .populate({
                path: 'brand',
                select: 'name',  // Explicitly select name field
                model: 'Brand' // Specify model if needed
            })
            .sort({ createdAt: -1 })
            .lean();

        console.log(products[0]?.category); // Debug: Check first product's category
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching products',
            error: err.message
        });
    }
});

// Get all products for visitors
router.get('/products/view/all', async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'category',
                select: 'name',  // Explicitly select name field
                model: 'Category' // Specify model if needed
            })
            .populate({
                path: 'brand',
                select: 'name',  // Explicitly select name field
                model: 'Brand' // Specify model if needed
            })
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching products',
            error: err.message
        });
    }
});

// // Get single product
// router.get('/products/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.json(product);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: 'Error fetching product',
//             error: err.message
//         });
//     }
// });

// Get single product for view
router.get('/products/view/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'brand',
                select: '_id name',
                model: 'Brand' // Explicitly specify model
            })
            .populate({
                path: 'category',
                select: '_id name',
                model: 'Category' // Explicitly specify model
            })
            .populate({
                path: 'reviews.user',
                select: 'firstName lastName',
                model: 'User'
            });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Format reviews to include combined name
        const formattedReviews = product.reviews.map(review => {
            return {
                ...review.toObject(),
                name: review.user
                    ? `${review.user.firstName} ${review.user.lastName}`
                    : review.name || 'Anonymous'
            };
        });

        res.json({
            _id: product._id,
            name: product.name,
            brand: product.brand ? {
                _id: product.brand._id,  // Include brand ID
                name: product.brand.name
            } : null,
            category: product.category ? {
                _id: product.category._id,  // Include category ID
                name: product.category.name
            } : null,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
            image: product.image,
            reviews: product.reviews,
            rating: product.rating,
            numReviews: product.numReviews,
            // include other fields as needed
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching product',
            error: err.message
        });
    }
});


// // product review api
// router.post('/products/:id/reviews', protect, async (req, res) => {
//     const { rating, comment } = req.body;

//     // Input validation
//     if (!rating || rating < 1 || rating > 5) {
//         return res.status(400).json({
//             success: false,
//             message: 'Please provide a valid rating between 1 and 5'
//         });
//     }

//     if (!comment || comment.trim().length < 10) {
//         return res.status(400).json({
//             success: false,
//             message: 'Review comment must be at least 10 characters long'
//         });
//     }

//     try {
//         const product = await Product.findById(req.params.id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }

//         // Check if user already reviewed this product
//         const alreadyReviewed = product.reviews.find(
//             r => r.user.toString() === req.user._id.toString()
//         );

//         if (alreadyReviewed) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'You have already reviewed this product'
//             });
//         }

//         const review = {
//             user: req.user._id,
//             name: req.user.name,
//             rating: Number(rating),
//             comment: comment.trim(),
//             createdAt: new Date()
//         };

//         product.reviews.push(review);
//         product.numReviews = product.reviews.length;

//         // Calculate average rating
//         product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

//         await product.save();

//         // Populate the user field in the review for the response
//         const savedProduct = await Product.findById(req.params.id)
//             .populate('reviews.user', 'name');

//         res.status(201).json({
//             success: true,
//             message: 'Review added successfully',
//             product: savedProduct
//         });
//     } catch (err) {
//         console.error('Review submission error:', err);
//         res.status(500).json({
//             success: false,
//             message: 'Server Error',
//             error: err.message
//         });
//     }
// });


router.post('/products/:id/reviews', protect, async (req, res) => {
    try {
        // Validate input
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid rating between 1 and 5'
            });
        }

        if (!comment || comment.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Review must be at least 10 characters'
            });
        }

        // Verify product exists
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check for existing review
        const existingReview = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Get user details to save name
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add new review
        const review = {
            user: req.user._id,
            // name: req.user.name,
            name: `${user.firstName} ${user.lastName}`, // Combine first and last name
            rating: Number(rating),
            comment: comment.trim(),
            createdAt: new Date()
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        // Return updated product
        const updatedProduct = await Product.findById(req.params.id)
            .populate('reviews.user', 'name');

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            product: updatedProduct
        });

    } catch (err) {
        console.error('Review submission error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


// Get single product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            _id: product._id,
            name: product.name,
            description: product.description,
            image: product.image,
            // include other fields as needed
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching product',
            error: err.message
        });
    }
});

// Update product with optional image update
router.put('/products/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        let image = product.image;

        // If new image is uploaded
        if (req.file) {
            // Delete old image if it exists
            if (product.image && product.image.public_id) {
                await deleteImage(product.image.public_id);
            }

            // Use the same format as your POST route
            image = {
                public_id: req.file.filename,  // Changed to match your POST route
                url: req.file.path            // Changed to match your POST route
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                image: image || product.image, // Fallback to existing image if none provided
                updatedAt: Date.now()
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: 'Product updated successfully',
            product: {
                _id: updatedProduct._id,
                name: updatedProduct.name,
                description: updatedProduct.description,
                image: updatedProduct.image.url,
                updatedAt: updatedProduct.updatedAt
            }
        });

    } catch (err) {
        console.error(err);

        // Clean up uploaded file if error occurred after upload
        if (req.file && req.file.filename) {
            await deleteImage(req.file.filename);
        }

        res.status(500).json({
            message: 'Error updating product',
            error: err.message
        });
    }
});

// Delete product with image cleanup
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete image from Cloudinary
        await deleteImage(product.image.public_id);

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Product deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting product',
            error: err.message
        });
    }
});


router.get('/products/related/:brandId', async (req, res) => {
    try {
        const { brandId } = req.params;
        const { exclude } = req.query;

        console.log('Raw params:', {
            brandId: brandId,
            brandIdType: typeof brandId,
            exclude: exclude
        });

        // More robust validation
        if (typeof brandId !== 'string' || !brandId.match(/^[0-9a-fA-F]{24}$/)) {
            console.error('Invalid brand ID format received:', brandId);
            return res.status(400).json({
                message: 'Invalid brand ID format',
                received: brandId,
                expected: '24-character hex string'
            });
        }

        const query = {
            brand: new mongoose.Types.ObjectId(brandId),
            _id: { $ne: new mongoose.Types.ObjectId(exclude) }
        };

        console.log('Final query:', query);

        const relatedProducts = await Product.find(query)
            .limit(4)
            .select('name price image shortDescription')
            .lean();

        console.log('Found products:', relatedProducts.length);
        res.json(relatedProducts);
    } catch (err) {
        console.error('Full error:', err);
        res.status(500).json({
            message: 'Error fetching related products',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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