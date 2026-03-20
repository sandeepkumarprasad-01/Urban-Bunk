const fs = require('fs');
try {
  require('./app.js');
} catch (err) {
  fs.writeFileSync('error.txt', err.stack);
}
