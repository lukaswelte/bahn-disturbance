var express = require('express');
var router = express.Router();
var importer = require('../importer/import');
var db = require('../service/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("OK");
});

router.get('/map', function(req, res, next) {
  db.getItemsBetweenTime(1446761624000, 1546764445027, function (err, data) {
    if (err) {
      console.error(err);
    }

    var heatmapData = data.map(function (ride) {
      var initRecord = ride.records[0];
      var delays = ride.records.filter(function(r) {
        return r.delay !== undefined && r.delay > 0 && !isNaN(r.lat) && !isNaN(r.lon);
      });

      return delays.map (function(r) {
        return [r.lat, r.lon, parseInt(r.delay, 10)];
      });
    });

    var d = [].concat.apply([], heatmapData);
    res.render('index', { title: 'Express', heatmapData: JSON.stringify(d) });
  });
});

/*router.get('/import', function(req, res, next) {
  importer.extract("zugsonar.20151106.json.stream.7z");
  res.render('index', {title: 'Imported'});
});

router.get('/list', function (req, res, next) {

  db.getItems(function (err, items) {
    res.send(items);
  });


});*/

module.exports = router;
