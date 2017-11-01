var Msg = require('../messages');
var { appendNewRecords } = require('./lib');
var csvParser = require('../service/csvParser');

describe('Logic for /api/csv', () => {

  let mockedModel;

  beforeEach(() => {
    mockedModel = {
      findOne: jest.fn(), //() => Promise.resolve([{a: 1}, {a: 2}]),
      save: jest.fn(),
      update: jest.fn()
    };
  });

  afterEach(() => {
    mockedModel = null;
  });

  describe('ideal scenario', () => {

    it('should merge parsed CSV data with the existing data', () => {
      const failureFn = jest.fn();
      const mockedCSV = 'q,w\n1,2\n4,5'
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}, {a: 2}]))
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

  });

  describe('payload is corrupted', () => {

    it('should fail if the request body is empty', () => {
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}, {a: 2}]))
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
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}, {a: 2}]))
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

  describe('model is cheeky', () => {

    it('should fail if the read from model is unsuccessful', () => {
      const failedMsg = new Error('Failed to read from model');
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.reject(failedMsg))
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
      const failedMsg = new Error('Failed to save model');
      const successFn = jest.fn();
      mockedModel.findOne.mockReturnValueOnce(Promise.resolve([{a: 1}]));
      mockedModel.save.mockReturnValueOnce(Promise.reject(failedMsg));
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

  });

});
