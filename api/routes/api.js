const debug = require('debug')('financisto:api-router');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ type: 'application/json'});
const UserData = require('../models/userData');
const { appendNewRecords, readPreviousUpload } = require('./lib');

// GET:api/uploads :: Rq { } -> Rs String List Model
router.get('/uploads', jsonParser, (req, res) => {
  debug('GET\tapi/uploads');

  readPreviousUpload()
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
  debug('POST\tapi/uploads:\n%s', req.body.csv);

  appendNewRecords
    .run({
      model: UserData,
      requestBody: req.body,
    })
    .fork(
      err => res.status(500).json({ error: err }),
      result => res.json(result)
    )
});

module.exports = router;
