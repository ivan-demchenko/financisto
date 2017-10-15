const parse = require('./csvParser');

const sampleData = ```
col1,col2
1,2
a,b
```;

test('parse a file', () => {
    expect(parse(sampleData)).toBe([
        { col1: 1, col2: 2},
        { col1: 'a', col2: 'b'},
    ]);
})