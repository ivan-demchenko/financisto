const parseCSV = require('./csvParser');

describe('parse a file', () => {
    it('should return an array of object when there are records', () => {

        const sampleData = [
            'Bank Account,Date,Narrative,Debit Amount,Credit Amount,Categories,Serial',
            '123,09/10/2017,"WITHDRAWAL ....",70.00,,CASH,',
            '123,11/10/2017,"WITHDRAWAL ....",10.00,xxx,CASH,yyy'
        ].join("\n");

        expect(parseCSV(sampleData)).toEqual([
            {
                'Bank Account':'123',
                'Date':'09/10/2017',
                'Narrative':'WITHDRAWAL ....',
                'Debit Amount':'70.00',
                'Credit Amount':'',
                'Categories':'CASH',
                'Serial':''
            },
            {
                'Bank Account':'123',
                'Date':'11/10/2017',
                'Narrative':'WITHDRAWAL ....',
                'Debit Amount':'10.00',
                'Credit Amount':'xxx',
                'Categories':'CASH',
                'Serial':'yyy'
            }
        ]);
    });

    it('should return an empty array when there are no records', () => {
        const sampleData = [ "Bank Account,Date,Notes" ].join("\n");
        expect(parseCSV(sampleData)).toEqual([]);
    });
})