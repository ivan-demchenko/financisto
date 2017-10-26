var Msg = require('../messages');
var { appendNewRecords } = require('./lib');
var csvParser = require('../service/csvParser');

describe('Logic for /api/csv', () => {

  let mockedModel;

  beforeEach(() => {
    mockedModel = {
      find: (cb) => cb(null, [{a: 1}, {a: 2}]),
      update: jest.fn()
    };
  });

  afterEach(() => {
    mockedModel = null;
  });

  describe('empty request body or missing info in request body', () => {

    it('should merge with the previous data', () => {
      const failureFn = jest.fn();
      const mockedCSV = 'q,w\n1,2\n4,5'
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
            expect(data).toEqual([{a: 1}, {a: 2}].concat(csvParser(mockedCSV)))
          }
        );
      expect(failureFn.mock.calls.length).toBe(0);
    });

    it('should fail if the request body is empty', () => {
      const successFn = jest.fn();
      appendNewRecords
        .run({ model: mockedModel, requestBody: {} })
        .fork(
          err => {
            expect(err).toBe(Msg.api.csv.missingData);
            expect(mockedModel.update.mock.calls.length).toBe(0);
          },
          successFn
        );
      expect(successFn.mock.calls.length).toBe(0);
    });

    it('should fail if `csv` is empty within request body', () => {
      const successFn = jest.fn();
      appendNewRecords
        .run({ model: mockedModel, requestBody: { csv: '' } })
        .fork(
          err => {
            expect(err).toBe(Msg.api.csv.missingData);
            expect(mockedModel.update.mock.calls.length).toBe(0);
          },
          successFn
        );
      expect(successFn.mock.calls.length).toBe(0);
    });

  });

});
