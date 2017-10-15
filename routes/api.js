var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var debug = require('debug')('financier:api');
var jsonParser = bodyParser.json({ type: 'application/json'});
var { groupByMonthAndCategory, returnUnknownsOnly } = require('../service/main');
var MongoClient = require('mongodb').MongoClient;

router.post('/csv', jsonParser, (req, res, next) => {

  var url = 'mongodb://mongodb:27017/financier';
  MongoClient.connect(url, function(err, db) {
    debug("Connected correctly to server.");
    db.close();
  });

  res.json({
    grouped: groupByMonthAndCategory(req.body.csv),
    unknowns: returnUnknownsOnly(req.body.csv)
  });
});

module.exports = router;
