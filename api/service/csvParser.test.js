const parseCSV = require('./csvParser');

describe('parse a file', () => {
    it('should return an array of object when there are records', () => {

        const sampleData = [
            "Bank Account,Date,Notes",
            "123,09/10/2017,\"Some comments\",",
            "123,07/11/2017,\"Other comments\","
        ].join("\n");

        expect(parseCSV(sampleData)).toEqual([
            { "Bank Account": "123", "Date": '09/10/2017', "Notes": "Some comments" },
            { "Bank Account": "123", "Date": '07/11/2017', "Notes": "Other comments" }
        ]);
    });

    it('should return an empty array when there are no records', () => {
        const sampleData = [ "Bank Account,Date,Notes" ].join("\n");
        expect(parseCSV(sampleData)).toEqual([]);
    });
})