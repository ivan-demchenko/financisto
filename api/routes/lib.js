const parseCSV = require('../service/csvParser');
const Reader = require('fantasy-readers');
const Task = require('data.task');
const Either = require('data.either');
const Msg = require('../messages');
const mergeRecords = require('../service/mergeRecords');
const { objOf, prop, compose, composeK } = require('ramda');

// -- type RequestBody = { csv : string }
// -- type Env = { model : MongooseModel, requestBody : RequestBody }

// -- eitherToTask :: Either e a -> Task e a
const eitherToTask = either => either.fold(Task.rejected, Task.of);

const ReaderEither = Reader.ReaderT(Either);
const ReaderTask = Reader.ReaderT(Task);

// -- validateRequest :: ReaderT Env (Either String String)
const validateRequest = () =>
  ReaderEither(env =>
    env.requestBody.csv && env.requestBody.csv.length
      ? Either.Right(env.requestBody.csv)
      : Either.Left(Msg.api.csv.missingData)
  );

//  -- populateModel :: Data -> ReaderT Env (Task String) MongooseModel
const populateModel = (data) =>
  ReaderTask(env =>
    Task.of(new env.model({ data: data }))
  );

// -- saveModel :: MongooseModel -> ReaderT Env (Task String) String
const saveModel = (modelInstance) =>
  ReaderTask(() =>
    new Task((reject, resolve) => {
      return modelInstance.save()
        .then(compose(resolve, objOf('id'), prop('_id')))
        .catch(compose(reject, prop('message')))
    })
  );

const populateAndSaveModel = composeK(saveModel, populateModel);

// -- readPreviousUpload :: ReaderT Env (Task String) Data
const readPreviousUpload = () =>
  ReaderTask(env =>
    new Task((rej, res) =>
      env.model.findOne()
        .then(compose(res, prop('data')))
        .catch(compose(rej, prop('message')))
    )
  );

// -- readerEither2ReaderTask :: ReaderT Env (Either e) a -> ReaderT Env (Task e) a
const readerEither2ReaderTask = env => readerEither =>
  ReaderTask(() => eitherToTask(readerEither.run(env)))

const appendNewRecords =
  ReaderEither.ask.chain(env => // ReaderT Env (Either ()) Env
    readerEither2ReaderTask(env)(
      validateRequest() // ReaderT Env (Either Err) String
        .map(parseCSV) // ReaderT Env (Either Err) IncomingData
    ) // ReaderT Env (Task Err) IncomingData
  )
    .chain(incomingData => // IncomingData
      readPreviousUpload() // ReaderT Env (Task Err) ExistingData
        .map(mergeRecords(incomingData)) // ReaderT Env (Task Err) MergedData
    )
    .chain(populateAndSaveModel) // ReaderT Env (Either Err) { id: String }

module.exports = {
  validateRequest,
  populateModel,
  saveModel,
  readPreviousUpload,
  eitherToTask,
  appendNewRecords,
  readerEither2ReaderTask
};
