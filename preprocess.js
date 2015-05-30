var preprocess = require('preprocess');
var DataURI = require('datauri');

// Simple wrapper around fs.readFileSync and fs.writeFileSync
preprocess.preprocessFileSync(__dirname + '/public/index.html', __dirname + '/index.html', {
  DEBUG: true
});


DataURI(__dirname + '/public/assets/conway.jpg', function(err, content) {

  if (err) {
    throw err;
  }

  preprocess.preprocessFileSync(__dirname + '/public/index.html', __dirname + '/dist/index.html', {
    DEBUG: false,
    IMG_SRC: content
  });

});