var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var debug = require('debug')('financier:api');
var jsonParser = bodyParser.json({ type: 'application/json'});
var { groupByMonthAndCategory, returnUnknownsOnly } = require('../service/main');
var Reader = require('fantasy-readers');

router.post('/csv', jsonParser, (req, res, next) => {

  debug('received some data to /csv');

  res.json({
    grouped: {}, //groupByMonthAndCategory(req.body.csv),
    unknowns: {} //returnUnknownsOnly(req.body.csv)
  });

});

const saveData = (data) =>
  new Reader(env => {
    env.db.insert(data)
  })

module.exports = router;
