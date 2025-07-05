const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Brand',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Category',
    },
    shortDescription: {
        type: String,
    },
    longDescription: {
        type: String,
    },
    additionalInformation: {
        type: String,
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    reviews: [reviewSchema],

    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


module.exports = mongoose.model('Product', productSchema);