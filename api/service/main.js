const r = require('ramda');
const guessCategory = require('./categoriser');

const normaliseNarrative =
  r.map(r.evolve({
    Narrative: r.compose(r.trim, r.replace('DEBIT CARD PURCHASE', ''))
  }));

const cleanUpFields =
  r.map(
    r.compose(
      r.dissoc('Bank Account'),
      r.dissoc('Serial'),
      r.dissoc('Debit Amount'),
      r.dissoc('Credit Amount')
    )
  );

const normaliseAmounts =
  r.compose(
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
    r.map(r.evolve({
      'Debit Amount': r.compose(r.multiply(-1), Number),
      'Credit Amount': Number
    }))
  );

const groupByMonth =
  r.groupBy(
    r.pipe(
      r.prop('Date'),
      r.split('/'),
      r.nth(1)
    )
  );

const groupByCategory =
  r.map(
    r.groupBy(r.prop('Category'))
  );

const applyCategoriser =
  r.map(
    r.converge(r.merge, [
      r.identity,
      r.pipe(
        r.prop('Narrative'),
        r.toLower,
        guessCategory,
        r.objOf('Category')
      )
    ])
  );

const sumByAmount =
  r.map(r.map(
    r.compose(r.sum, r.pluck('Amount'))
  ));

const filterUnknownCategory =
  r.filter(r.whereEq({ Category: 'Unknown' }))

const groupByMonthAndCategory = r.pipe(
  normaliseNarrative,
  normaliseAmounts,
  cleanUpFields,
  applyCategoriser,
  groupByMonth,
  groupByCategory,
  sumByAmount
);

const returnUnknownsOnly = r.pipe(
  normaliseNarrative,
  applyCategoriser,
  filterUnknownCategory
);

module.exports = {
  groupByMonthAndCategory,
  returnUnknownsOnly
}
