var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var debug = require('debug')('financisto:api-router');
var jsonParser = bodyParser.json({ type: 'application/json'});
var parseCSV = require('../service/csvParser');
var UserData = require('../models/userData');
var Reader = require('fantasy-readers');
var Task = require('data.task');
var Either = require('data.either');

router.post('/csv', jsonParser, (req, res, next) => {

  debug('api/csv: data has arrived: \n%s', req.body.csv);

  validateRequest()
    .map(parseCSVText)
    .chain(populateModel)
    .chain(saveModel)
    .run({
      model: new UserData(),
      requestBody: req.body
    })
    .fork(
      err => res.status(500).json({ error: err }),
      result => res.json({ result: result })
    );

});

/// - eitherToTask :: Either e a -> Task e a
const eitherToTask = e => e.cata({
  Left: Task.rejected,
  Right: Task.of
});

/// - validateRequest :: Reader Env (Either String String)
const validateRequest = () =>
  new Reader(env =>
    env.requestBody.csv && env.requestBody.csv.length
      ? Either.Right(env.requestBody.csv)
      : Either.Left('`csv` field is empty of missing')
  );

/// - parseCSVText :: Either String String -> Either String Data
const parseCSVText = (eitherErrData) =>
  eitherErrData.map(parseCSV);

/// - populateModel :: Either String Data -> Reader Env (Either String MongooseModel)
const populateModel = (eitherErrData) =>
  new Reader(env =>
    eitherErrData
    .map(data => {
      env.model.data = data;
      return env.model;
    })
  );

/// - saveModel :: Either String MongooseModel -> Reader Env (Task String String)
const saveModel = (eitherErrModel) =>
  new Reader(env => 
    eitherToTask(eitherErrModel)
      .chain(model =>
        new Task((rej, res) =>
          model.save((err) => err ? rej(err.message) : res('Saved'))
        )
      )
    );

module.exports = router;
