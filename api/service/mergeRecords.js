const { concat, uniq, compose, useWith, defaultTo } = require('ramda');

module.exports = useWith(
  compose(uniq, concat), [
    defaultTo([]),
    defaultTo([])
  ]
);
