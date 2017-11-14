var Msg = require('../messages');
var Either = require('data.either');
var Task = require('data.task');
var Reader = require('fantasy-readers');
var { appendNewRecords, readerEither2ReaderTask } = require('./lib');
var csvParser = require('../service/csvParser');

describe('Logic for /api/csv', () => {

  let mockedModel;

  beforeEach(() => {
    const findOneMock = jest.fn();
    const findOneAndUpdateMock = jest.fn((a, b, c, cb) => {
      cb(null, []);
    });

    function MockedModel() {
      this.findOne = findOneMock;
      this.findOneAndUpdate = findOneAndUpdateMock;
    }

    MockedModel.findOne = findOneMock;
    MockedModel.findOneAndUpdate = findOneAndUpdateMock;

    mockedModel = MockedModel;
  });

  afterEach(() => {
    mockedModel = null;
  });

  describe('ideal scenario', () => {

    it('should merge parsed CSV data with the existing data', () => {
      const failureFn = jest.fn();
      const mockedCSV = 'q,w\n1,2\n4,5'
      const parsedMockedCVS = csvParser(mockedCSV);
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}, {a: 2}]));
      mockedModel.findOneAndUpdate.mockImplementation((a, upd, c, cb) => {
        cb(null, [{a: 1}, {a: 2}].concat(upd));
      });

      appendNewRecords
        .run({
          model: mockedModel,
          requestBody: {
            csv: mockedCSV
          }
        })
        .fork(
          failureFn,
          (data) => {
            expect(data).toEqual([{a: 1}, {a: 2}].concat(parsedMockedCVS))
          }
        );
      expect(failureFn.mock.calls.length).toBe(0);
    });

  });

  describe('payload is corrupted', () => {

    it('should fail if the request body is empty', () => {
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}, {a: 2}]));
      mockedModel.findOneAndUpdate.mockImplementation((a, upd, c, cb) => {
        cb(null, [{a: 1}, {a: 2}].concat(upd));
      });
      appendNewRecords
        .run({ model: mockedModel, requestBody: {} })
        .fork(
          err => {
            expect(err).toBe(Msg.api.csv.missingData);
            expect(mockedModel.findOne.mock.calls.length).toBe(0);
            expect(mockedModel.findOneAndUpdate.mock.calls.length).toBe(0);
          },
          successFn
        );
      expect(successFn.mock.calls.length).toBe(0);
    });

    it('should fail if `csv` is empty within request body', () => {
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}, {a: 2}]));
      mockedModel.findOneAndUpdate.mockImplementation((a, upd, c, cb) => {
        cb(null, [{a: 1}, {a: 2}].concat(upd));
      });
      appendNewRecords
        .run({ model: mockedModel, requestBody: { csv: '' } })
        .fork(
          err => {
            expect(err).toBe(Msg.api.csv.missingData);
            expect(mockedModel.findOne.mock.calls.length).toBe(0);
            expect(mockedModel.findOneAndUpdate.mock.calls.length).toBe(0);
          },
          successFn
        );
      expect(successFn.mock.calls.length).toBe(0);
    });

  });

  describe('model is cheeky', () => {

    it('should fail if the read from model is unsuccessful', () => {
      const failedMsg = new Error('Failed to read from model');
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.reject(failedMsg))
      mockedModel.findOneAndUpdate.mockImplementation((a, upd, c, cb) => {
        cb(new Error('Failed to execute'), null);
      });
      appendNewRecords
        .run({ model: mockedModel, requestBody: { csv: 'a,b\n1,2' } })
        .fork(
          err => {
            expect(err).toBe(failedMsg.message);
            expect(mockedModel.update.mock.calls.length).toBe(0);
          },
          successFn
        );
      expect(successFn.mock.calls.length).toBe(0);
    });

    it('should fail if saving the model was unsuccessful but read was good', () => {
      const failedError = new Error('Failed to save model');
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.reject(failedError))
      mockedModel.findOneAndUpdate.mockImplementation((a, upd, c, cb) => {
        cb(failedError, null);
      });
      appendNewRecords
        .run({ model: mockedModel, requestBody: { csv: 'a,b\n1,2' } })
        .fork(
          err => {
            expect(err).toBe(failedError.message);
            expect(mockedModel.update.mock.calls.length).toBe(0);
          },
          successFn
        );
      expect(successFn.mock.calls.length).toBe(0);
    });

  });

});

describe('Monad Transformer Natural Transformation', () => {

  const ReaderEither = Reader.ReaderT(Either);

  test('naturally transform Either to Task inside ReaderT', () => {
    ReaderEither(env => Either.Right(env.x))
      .chain(xFromEither => {
        expect(xFromEither).toBe(10);
        return Reader.ReaderT(Task)(() => Task.of(xFromEither))
      })
      .run({ x: 10 })
      .fork(e => e, x => expect(x).toBe(10));
  });

  test('readerT of either', () => {
    const x = ReaderEither.of(100).run()
    expect(x.toString()).toBe("Either.Right(100)");
  });

  test('check the type', () => {
    const rdr = ReaderEither(env => env.x >= 10 ? Either.Right('Good') : Either.Left('Bad'));
    expect(rdr.run({x: 5}).toString()).toBe('Either.Left(Bad)')
    expect(rdr.run({x: 15}).toString()).toBe('Either.Right(Good)')
  });

  test('fold on readerEither', () => {
    const rdr = ReaderEither(env => env.x >= 10 ? Either.Right('Good') : Either.Left('Bad'));
    const r1 = rdr.run({ x: 20 });
    expect(r1.fold).toBeInstanceOf(Function);
    const r2 = r1.fold(Task.rejected, Task.of);
    expect(r2).toBeInstanceOf(Task);
  });

  test('task should be resolved if transformed from Either.Right', () => {
    const rdrEither = ReaderEither(env => env.x >= 10 ? Either.Right('Good') : Either.Left('Bad'));

    const r1 = ReaderEither.ask.chain(env =>
      readerEither2ReaderTask(env)(rdrEither)
    ).run({ x: 20 });

    expect(r1).toBeInstanceOf(Task);
    expect(r1.fork).toBeInstanceOf(Function); 

    const rejFn = jest.fn();
    const resFn = jest.fn();

    r1.fork(rejFn, resFn);

    expect(rejFn.mock.calls.length).toBe(0);
    expect(resFn.mock.calls.length).toBe(1);
    expect(resFn.mock.calls[0]).toEqual(['Good']);
  });

  test('task should be rejected if transformed from Either.Left', () => {
    const rdrEither = ReaderEither(env => env.x >= 10 ? Either.Right('Good') : Either.Left('Bad'));

    const r1 = ReaderEither.ask.chain(env =>
      readerEither2ReaderTask(env)(rdrEither)
    ).run({ x: 5 });

    expect(r1).toBeInstanceOf(Task);
    expect(r1.fork).toBeInstanceOf(Function); 

    const rejFn = jest.fn();
    const resFn = jest.fn();

    r1.fork(rejFn, resFn);

    expect(rejFn.mock.calls.length).toBe(1);
    expect(rejFn.mock.calls[0]).toEqual(['Bad']);
    expect(resFn.mock.calls.length).toBe(0);
  });

});
