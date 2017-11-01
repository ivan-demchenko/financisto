const parseCSV = require('../service/csvParser');
const Reader = require('fantasy-readers');
const Task = require('data.task');
const Either = require('data.either');
const Msg = require('../messages');
const mergeRecords = require('../service/mergeRecords');
const { objOf, prop, compose } = require('ramda');

// -- type RequestBody = { csv : string }
// -- type Env = { model : MongooseModel, requestBody : RequestBody }

// -- eitherToTask :: Either e a -> Task e a
const eitherToTask = e => e.fold(Task.rejected, Task.of);

// -- validateRequest :: ReaderT Env (Either String String)
const validateRequest = () =>
  Reader.ReaderT(Either)(env =>
    env.requestBody.csv && env.requestBody.csv.length
      ? Either.Right(env.requestBody.csv)
      : Either.Left(Msg.api.csv.missingData)
  );

//  -- populateModel :: Data -> ReaderT Env (Task String MongooseModel)
const populateModel = (data) =>
  Reader.ReaderT(Task)(env =>
    new Task((reject, resolve) =>
      resolve(new env.model({ data: data }))
    )
  );

// -- saveModel :: MongooseModel -> ReaderT Env (Task String String)
const updateModel = (model) =>
  Reader.ReaderT(Task)(() =>
    new Task((reject, resolve) =>
      model.save()
        .then(compose(resolve, objOf('id'), prop('_id')))
        .catch(compose(reject, prop('message')))
    )
  );

// -- readPreviousUpload :: ReaderT Env (Task String Data)
const readPreviousUpload = () =>
  Reader.ReaderT(Task)(env =>
    new Task((rej, res) =>
      env.model.findOne()
        .then(compose(res, prop('data')))
        .catch(compose(rej, prop('message')))
    )
  );

const appendNewRecords =
  validateRequest() // ReaderT Env (Either Err String)
    .map(parseCSV) // ReaderT Env (Either Err IncomingData)
    .chain(data => // Data
      readPreviousUpload() // ReaderT Env (Task Err ExistingData)
        .map(mergeRecords(data)) // ReaderT Env (Either Err MergedData)
    )
    .chain(populateModel) // ReaderT Env (Either Err MongooseModel)
    .chain(updateModel) // ReaderT Env (Either Err { id: String })

module.exports = {
  validateRequest,
  populateModel,
  updateModel,
  readPreviousUpload,
  eitherToTask,
  appendNewRecords
};
