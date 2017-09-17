var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ type: 'application/json'});
var { groupByMonthAndCategory, returnUnknownsOnly } = require('../service/main');

router.post('/csv', jsonParser, (req, res, next) => {
  res.json({
    grouped: groupByMonthAndCategory(req.body.csv),
    unknowns: returnUnknownsOnly(req.body.csv)
  });
});

module.exports = router;
