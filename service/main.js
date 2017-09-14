const path = require('path');
const r = require('ramda');
const fs = require('fs');
const csvFilePath = path.join(__dirname, '../..', 'Downloads/trdata.csv');
const guessCategory = require('./categoriser');

const parseCSV = r.compose(
    r.converge(r.map, [
        r.compose(r.zipObj, r.split(','), r.head),
        r.compose(r.split(','), r.tail)
    ]),
    r.split('\n')
)

const app =
r.pipe(
    fs.readFileSync,
    parseCSV,
    r.map(r.evolve({
        Narrative: r.compose(r.trim, r.replace('DEBIT CARD PURCHASE', '')),
        'Debit Amount': r.compose(r.multiply(-1), Number),
        'Credit Amount': Number
    })),
    r.map(
        r.converge(r.merge, [
            r.identity,
            r.compose(
                r.objOf('Amount'),
                r.converge(r.add, [
                    r.prop('Debit Amount'),
                    r.prop('Credit Amount')
                ])
            )
        ])
    ),
    r.map(
        r.compose(
            r.dissoc('Bank Account'),
            r.dissoc('Serial'),
            r.dissoc('Debit Amount'),
            r.dissoc('Credit Amount')
        )
    ),
    r.map(
        r.converge(r.merge, [
            r.identity,
            r.pipe(
                r.prop('Narrative'),
                r.toLower,
                guessCategory,
                r.objOf('Category'),
            )
        ])
    ),
    r.groupBy(
        r.pipe(
            r.prop('Date'),
            r.split('/'),
            r.nth(1)
        )
    ),
    r.map(
        r.groupBy(r.prop('Category'))
    ),
    
    r.map(r.map(
        r.compose(r.sum, r.pluck('Amount'))
    ))
)

csv()
.fromFile(csvFilePath)
.on('json', x => data.push(x))
.on('done', () => {
    console.log(app(data));
});