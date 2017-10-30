const parseCSV = require('../service/csvParser');
const Reader = require('fantasy-readers');
const Task = require('data.task');
const Either = require('data.either');
const Msg = require('../messages');
const mergeRecords = require('../service/mergeRecords');
const { objOf, prop, compose, lift, composeK } = require('ramda');

// -- type RequestBody = { csv : string }
// -- type Env = { model : MongooseModel, requestBody : RequestBody }

// -- eitherToTask :: Either e a -> Task e a
const eitherToTask = e => e.fold(Task.rejected, Task.of);

// -- validateRequest :: Reader Env (Either String String)
const validateRequest = () =>
  new Reader(env =>
    env.requestBody.csv && env.requestBody.csv.length
      ? Either.Right(env.requestBody.csv)
      : Either.Left(Msg.api.csv.missingData)
  );

//  -- populateModel :: Task String Data -> Reader Env (Task String MongooseModel)
const populateModel = (taskErrData) =>
  new Reader(env =>
    taskErrData.map(data => new env.model({ data: data }))
  );

// -- saveModel :: Task String MongooseModel -> Reader Env (Task String String)
const updateModel = (taskErrModel) =>
  new Reader(() =>
    taskErrModel
      .chain(model =>
        new Task((reject, resolve) =>
          model.save()
            .then(compose(resolve, objOf('id'), prop('_id')))
            .catch(compose(reject, prop('message')))
        )
      )
  );

// -- readPreviousUpload :: Reader Env (Task String Data)
const readPreviousUpload = () =>
  new Reader(env =>
    new Task((rej, res) =>
      env.model.find().then(res).catch(compose(rej, prop('message')))
    )
  );

const parseCSVText = (eitherErrStr) =>
  eitherErrStr.map(parseCSV)

const appendNewRecords =
  lift(lift(mergeRecords))(
    readPreviousUpload(),   // Reader Env (Task Err Data)
    validateRequest()       // Reader Env (Either Err String)
      .map(compose(eitherToTask, parseCSVText))  // Reader Env (Either Err Data)
  ).chain(composeK(populateModel, updateModel));

module.exports = {
  validateRequest,
  populateModel,
  updateModel,
  readPreviousUpload,
  eitherToTask,
  appendNewRecords
};
