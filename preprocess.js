var preprocess = require('preprocess');

// Simple wrapper around fs.readFileSync and fs.writeFileSync
preprocess.preprocessFileSync(__dirname + '/public/index.html', __dirname + '/index.html', {
  DEBUG: true
});

preprocess.preprocessFileSync(__dirname + '/public/index.html', __dirname + '/dist/index.html', {
  DEBUG: false
});