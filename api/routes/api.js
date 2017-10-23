var debug = require('debug')('financisto:api-router');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ type: 'application/json'});
var UserData = require('../models/userData');
var parseAndStoreData = require('./api.post.uploads');
var findData = require('./api.get.uploads');

// GET:api/uploads :: Rq { } -> Rs String List Model
router.get('/uploads', jsonParser, (req, res, next) => {

  debug('GET : api/uploads');

  findData()
    .run({
      model: UserData
    })
    .fork(
      error => res.status(500).send(error),
      data => res.json(data)
    );

});


// POST:api/uploads :: Rq { csv: String } -> Rs String { id: String }
router.post('/uploads', jsonParser, (req, res, next) => {

  debug('POST : api/uploads:\n%s', req.body.csv);

  parseAndStoreData()
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
