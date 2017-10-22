var Msg = require('../messages');
var saveCSV = require('./api.csv');

describe('Logic for /api/csv', () => {

    let mockedModel = {
        save: jest.fn()
    }

    describe('empty request body or missing info in request body', () => {

        let successFn = jest.fn();

        it('should fail if the request body is empty', () => {
            saveCSV()
            .run({ model: mockedModel, requestBody: {} })
            .fork(
                err => {
                    expect(err).toBe(Msg.api.csv.missingData);
                    expect(mockedModel.save.mock.calls.length).toBe(0);
                },
                successFn
            );
            expect(successFn.mock.calls.length).toBe(0);
        });

        it('should fail if `csv` is empty within request body', () => {
            saveCSV()
            .run({ model: mockedModel, requestBody: { csv: '' } })
            .fork(
                err => {
                    expect(err).toBe(Msg.api.csv.missingData);
                    expect(mockedModel.save.mock.calls.length).toBe(0);
                },
                successFn
            );
            expect(successFn.mock.calls.length).toBe(0);
        });

    });

    describe('call to save model', () => {

        let mockedCSVData = 'a,b\n1,2';
        let mockedErrFn = jest.fn();

        it('should reach to the point when the transformed data can be saved', () => {
            saveCSV()
            .run({
                model: mockedModel,
                requestBody: { csv: mockedCSVData }
            })
            .fork(
                mockedErrFn,
                res => {
                    expect(res).toBe('Saved')
                    expect(mockedModel.save.mock.calls.length).toBe(1)
                }
            );
            expect(mockedErrFn.mock.calls.length).toBe(0)
        });

    })

});