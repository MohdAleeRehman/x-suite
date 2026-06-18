/**
 * Seed script — creates the initial umair user in MongoDB
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const existing = await User.findOne({ username: 'umair' });
    if (existing) {
      console.log('ℹ️  User "umair" already exists. No changes made.');
      return;
    }

    const user = await User.create({
      username: 'umair',
      password: 'Au_Q9090',
      displayName: 'Umair'
    });

    console.log('✅ User created successfully!');
    console.log('   Username:', user.username);
    console.log('   Password: Au_Q9090 (plaintext for seeding purposes)');
    console.log('   Password is bcrypt-hashed in the database.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
