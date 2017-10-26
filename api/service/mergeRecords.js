const { concat, uniq, compose, useWith, defaultTo } = require('ramda');

// -- mergeRecords :: List a -> List a -> List a
const mergeRecords = useWith(
  compose(uniq, concat), [
    defaultTo([]),
    defaultTo([])
  ]
)

module.exports = mergeRecords;
