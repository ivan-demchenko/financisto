var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var debug = require('debug')('financisto:api-router');
var jsonParser = bodyParser.json({ type: 'application/json'});
var UserData = require('../models/userData');
var saveCSV = require('./api.csv');


router.post('/csv', jsonParser, (req, res, next) => {

  debug('api/csv: data has arrived: \n%s', req.body.csv);

  saveCSV()
    .run({
      model: new UserData(),
      requestBody: req.body
    })
    .fork(
      err => res.status(500).json({ error: err }),
      result => res.json(result)
    );

});

module.exports = router;
