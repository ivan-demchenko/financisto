const debug = require('debug')('financisto:api-router');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ type: 'application/json'});
const UserData = require('../models/userData');
const parseAndStoreData = require('./api.post.uploads');
const findData = require('./api.get.uploads');

// GET:api/uploads :: Rq { } -> Rs String List Model
router.get('/uploads', jsonParser, (req, res) => {
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
router.post('/uploads', jsonParser, (req, res) => {
  debug('POST : api/uploads:\n%s', req.body.csv);

  parseAndStoreData()
    .run({
      model: new UserData(),
      requestBody: req.body,
    })
    .fork(
      err => res.status(500).json({ error: err }),
      result => res.json(result)
    );
});

module.exports = router;
