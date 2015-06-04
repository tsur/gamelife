var preprocess = require('preprocess');
var DataURI = require('datauri');
var fs = require('fs');

// Simple wrapper around fs.readFileSync and fs.writeFileSync
preprocess.preprocessFileSync(__dirname + '/public/index.html', __dirname + '/index.html', {
  DEBUG: true
});

var imgProfile = new DataURI().format('.jpg', fs.readFileSync(__dirname + '/public/assets/conway.jpg'));
var imgEdit = new DataURI().format('.png', fs.readFileSync(__dirname + '/public/assets/edit.png'));
var imgPlay = new DataURI().format('.png', fs.readFileSync(__dirname + '/public/assets/play.png'));
var imgPause = new DataURI().format('.png', fs.readFileSync(__dirname + '/public/assets/pause.png'));
var imgRestart = new DataURI().format('.png', fs.readFileSync(__dirname + '/public/assets/restart.png'));

preprocess.preprocessFileSync(__dirname + '/public/index.html', __dirname + '/dist/index.html', {
  DEBUG: false,
  IMG_PROFILE: imgProfile.content,
  IMG_EDIT: imgEdit.content,
  IMG_PLAY: imgPlay.content,
  IMG_PAUSE: imgPause.content,
  IMG_RESTART: imgRestart.content
});