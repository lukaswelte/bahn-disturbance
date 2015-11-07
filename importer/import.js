var //dbService = require('../service/database'),
  request = require('request'),
  Zip = require('node-7z'),
  fs = require('fs'),
  path = require('path'),
  readline = require('linebyline'),
  db = require('../service/database');

var zipper = new Zip();
var destination = '/tmp';

function extract(filename) {

  zipper.extractFull(path.join(__dirname, filename), destination)

  // Equivalent to `on('data', function (files) { // ... });`
  .progress(saveToDatabase)

  // When all is done
  .then(function () {
    console.log('Extracting done!');
  })

  // On error
  .catch(function (err) {
    console.error(err);
  });
}


function saveToDatabase(files) {
  console.log('Some files are extracted: %s', files);

  files.map(function (file) {
    var filepath = path.join(destination, file);
    console.log('file: ', filepath);

    var read = readline(filepath);

    var f = path.join(destination, file + '-parsed.json');
    console.log("Filename: ", f);
    fs.writeFileSync(f, "[");

    read.on('line', function (line, lineCount) {
      var lineJson = JSON.parse(line);
      lineJson.ride = lineJson.id;
      delete lineJson.id;

      // db.insert(lineJson);
      fs.appendFileSync(f, JSON.stringify(lineJson) + ",");

    })
    .on('error', function (e) {
      console.error(e);
    });

  });

}

module.exports = {
  extract: extract
};
