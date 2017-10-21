var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var debug = require('debug')('financisto:api-router');
var jsonParser = bodyParser.json({ type: 'application/json'});
var parsedCSV = require('../service/csvParser');
var Reader = require('fantasy-readers');
var UserData = require('../models/userData');
var Task = require('data.task');

router.post('/csv', jsonParser, (req, res, next) => {

  debug('api/csv: data has arrived: \n%s', req.body.csv);

  saveData(parsedCSV(req.body.csv)) // Reader Env (Task String String)
  .run({ model: new UserData() }) // Task String String
  .fork(
    err => res.status(500).json({ error: err }),
    result => res.json({ result: result })
  );

});

/// - saveData :: ParsedCSV -> Reader Env (Task String String)
const saveData = (parsedData) =>
  new Reader(env =>
    new Task((rej, res) => {
      env.model.save((err) => err ? rej(err.message) : res('saved'))
    })
  );

module.exports = router;
