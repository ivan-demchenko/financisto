var debug = require('debug')('financisto:api-router');
var Reader = require('fantasy-readers');
var Task = require('data.task');
var UserData = require('../models/userData');

module.exports = () =>
    new Reader(env =>
        new Task((rej, res) =>
            env.model.find((err, data) => {
                if (err) { rej(err) }
                res(data)
            })
        )
    )