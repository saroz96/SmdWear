const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createDefaultUser = async () => {
  try {
    await mongoose.connect('mongodb+srv://saroj:12345@cluster0.vgu4kmg.mongodb.net/smdwear', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ email: 'smd@admin.com' });
    if (existingUser) {
      ('Default admin user already exists.');
      return;
    }

    // const hashedPassword = await bcrypt.hash('12345', 10);
    
    const defaultUser = new User({
      firstName: 'ADMINISTRATOR',
      email: 'smd@admin.com',
      password: '12345',
      role: 'admin' // Match your model's enum value
    });

    await defaultUser.save();
    ('Default admin user created successfully.');
  } catch (error) {
    console.error('Error creating default admin user:', error);
  } finally {
    // Don't disconnect - let the script exit naturally
    process.exit(0);
  }
};

createDefaultUser();