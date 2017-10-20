var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var debug = require('debug')('financisto:api-router');
var jsonParser = bodyParser.json({ type: 'application/json'});
var { groupByMonthAndCategory, returnUnknownsOnly } = require('../service/main');
var Reader = require('fantasy-readers');
var UserData = require('../models/userData');

router.post('/csv', jsonParser, (req, res, next) => {

  debug('Received some data to /csv, %j', req.body);

  res.json({
    data: req.body.data
  });

});

const saveData = (data) =>
  new Reader(env => {
    env.db.insert(data)
  })

module.exports = router;
