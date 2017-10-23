var Reader = require('fantasy-readers');
var Task = require('data.task');

const fetchUploads = () =>
  new Reader(env =>
    new Task((rej, res) =>
      env.model.find((err, data) => {
        if (err) { rej(err) }
        res(data)
      })
    )
  )

module.exports = fetchUploads
