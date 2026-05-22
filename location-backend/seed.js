require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = [
  { name: 'General Manager', email: 'admin@location.com', password: 'admin123', role: 'admin' },
  { name: 'Head Chef Executive', email: 'kitchen@location.com', password: 'chef123', role: 'kitchen' },
  { name: 'Chief Accountant', email: 'billing@location.com', password: 'cash123', role: 'billing' }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Clear out preexisting items to avoid token indexing duplications
    await User.deleteMany();
    console.log('Database context wiped cleanly for seed generation...');
    
    // Inject the new clean rows via the User model (pre-save hook hashes passwords automatically)
    await User.create(seedUsers);
    console.log('🚀 System profiles successfully seeded inside live database collections!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });