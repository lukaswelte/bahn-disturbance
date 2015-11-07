var express = require('express');
var router = express.Router();
var importer = require('../importer/import');
var db = require('../service/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/import', function(req, res, next) {
  importer.extract("zugsonar.20151106.json.stream.7z");
  res.render('index', {title: 'Imported'});
});

router.get('/list', function (req, res, next) {

  db.getItems(function (err, items) {
    res.send(items);
  });


});

module.exports = router;
