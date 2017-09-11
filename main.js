const csv = require('csvtojson');
const path = require('path');
const r = require('ramda');
const Table = require('cli-table');
let data = [];
const csvFilePath = path.join(__dirname, '../..', 'Downloads/trdata.csv');

const guessCategory = r.cond([
    [ r.test(/PARKING/ig)
    , r.always('Parking')
    ],
    [ r.test(/COLES|BAKERSDELIGHT|CELLARBRATIONS|LIQUORLAND|V\/CELLARS|The Junction Coffee/ig)
    , r.always('Food and drinks')
    ],
    [ r.test(/THE MORRISON BAR|SYDNEY TOWER EYE|CAFFE|Cafe|Scenic World Katoomba|ROYAL COPENHAGEN/ig)
    , r.always('Having fun')
    ],
    [ r.test(/H AND M/ig)
    , r.always('Clothings')
    ],
    [ r.test(/Burns Bay Medical|NATIONAL HOME DOCTOR|RNS HOSP EMERGENCY|Pharm/ig)
    , r.always('Medical/Pharmacy')
    ],
    [ r.test(/CHEMIST|TARGET|IKEA|Kidstuff|GOODGUYS/ig)
    , r.always('Chemist/Home stuff')
    ],
    [ r.test(/KATHMANDU|99 BIKES/ig)
    , r.always('Sports')
    ],
    [ r.test(/TPG Internet/ig)
    , r.always('Internet/Mobile')
    ],
    [ r.test(/OPAL|ETOLL|CABS/ig)
    , r.always('Transport')
    ],
    [ r.test(/atlassian/ig)
    , r.always('Income')
    ],
    [ r.test(/PYMT RAINE AND|LOCKSMITHS/ig)
    , r.always('Rent')
    ],
    [ r.T
    , r.always('Unknown')
    ]
]);

const app =
r.pipe(
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