const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true // Ensure email is case-insensitive
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['visitor', 'admin'],
        required: true,
        default: 'visitor'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Helper method to check admin roles
userSchema.methods.isAdmin = function () {
    return this.role === 'Admin' || this.role === 'ADMINISTRATOR';
};

module.exports = mongoose.model('User', userSchema);