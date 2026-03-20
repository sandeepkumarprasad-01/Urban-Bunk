require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing');

// These Unsplash photos were removed/deleted, use known-working replacements
const fixImages = {
  'Beachfront Condo': {
    url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    filename: 'beachfront-condo'
  },
  'Secluded Forest Cabin': {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    filename: 'forest-cabin'
  }
};

mongoose.connect(process.env.MONGO_URL).then(async () => {
  for (const [title, image] of Object.entries(fixImages)) {
    const result = await Listing.updateOne(
      { title },
      { $set: { image } }
    );
    console.log(title + ': ' + (result.modifiedCount > 0 ? 'UPDATED' : 'NOT FOUND/UNCHANGED'));
  }
  await mongoose.disconnect();
  console.log('Done fixing images!');
});
