const r = require('ramda');

const log = tag => x => (console.log(tag, x),x);

module.exports = r.compose(
    r.converge(r.map, [
        r.compose(
            r.zipObj, r.split(','), r.init, r.head
        ),
        r.compose(
            r.map(
                r.compose(r.map(r.replace(/\"/gi, '')), r.split(','), r.init)
            ),
            r.tail
        )
    ]),
    log('test things'),
    r.split('\n'),
    r.trim
);
