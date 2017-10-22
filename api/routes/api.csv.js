var parseCSV = require('../service/csvParser');
var Reader = require('fantasy-readers');
var Task = require('data.task');
var Either = require('data.either');

const saveCSV = () =>
validateRequest()
  .map(parseCSVText)
  .chain(populateModel)
  .chain(saveModel)

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

module.exports = saveCSV;