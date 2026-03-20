require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Listing = require('./models/listing');

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const listings = await Listing.find({}, 'title image').lean();
  let output = '';
  listings.forEach(l => {
    const hasUrl = l.image && l.image.url;
    const url = hasUrl ? l.image.url : 'NO_URL';
    const valid = hasUrl && (l.image.url.startsWith('http://') || l.image.url.startsWith('https://'));
    output += (valid ? 'OK    ' : 'BROKEN') + ' | ' + l.title + ' | ' + url + '\n';
  });
  output += 'Total: ' + listings.length + '\n';
  fs.writeFileSync('image-report.txt', output);
  console.log('Done - check image-report.txt');
  await mongoose.disconnect();
});
