const parseCSV = require('../service/csvParser');
const Reader = require('fantasy-readers');
const Task = require('data.task');
const Either = require('data.either');
const Msg = require('../messages');
const mergeRecords = require('../service/mergeRecords');
const { curry } = require('ramda');

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
    taskErrData
      .map(data => {
        env.model.data = data;
        return env.model;
      })
  );

// -- saveModel :: Task String MongooseModel -> Reader Env (Task String String)
const updateModel = (taskErrModel) =>
  new Reader(() =>
    taskErrModel
      .chain(model =>
        new Task((rej, res) =>
          model.update((err, data) => err ? rej(err.message) : res({id: data._id}))
        )
      )
  );

// -- readPreviousUpload :: Reader Env (Task String Data)
const readPreviousUpload = () =>
  new Reader(env =>
    new Task((rej, res) =>
      env.model.find((err, data) => {
        if (err) { rej(err.message) }
        res(data)
      })
    )
  );

// const lift2 = curry((f, a, b) =>
//   b.ap(a.map(f)));

const appendNewRecords =
  validateRequest()  // Reader Env (Either Err String)
    .map(eitherErrData => eitherErrData.map(parseCSV))  // Reader Env (Either Err Data)
    .map(eitherToTask)  // Reader Env (Task Err Data)
    .chain(taskErrIncoming =>  // Task Err Data
      readPreviousUpload()  // Reader Env (Task Err Data)
        .map(taskErrPrev =>  // Task String Data
          // lift2(mergeRecords, taskErrPrev, taskErrIncoming)
          taskErrPrev.chain(prev =>
            taskErrIncoming.map(inc => mergeRecords(prev, inc))
          )
        )
    )

module.exports = {
  validateRequest,
  populateModel,
  updateModel,
  readPreviousUpload,
  eitherToTask,
  appendNewRecords
};
