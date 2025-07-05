const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Brand',
    },
    description: {
        type: String,
        required: true,
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
categorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


module.exports = mongoose.model('Category', categorySchema);