var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('financisto:api');

// Logs

var accessLogStream = fs.createWriteStream(
    path.join(__dirname, '_logs', 'access.log'), {flags: 'a'}
);
var loggerFormat = ':date[web] > :method :status <> :url << :res[content-length] - :response-time ms';

// DB

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongodb:27017/financisto', {
    useMongoClient: true
}).then(
    () => debug('Connected to data base'),
    (err) => debug('ERROR: Connected was not established', err)
)

// App

var app = express();

app.use(logger(loggerFormat, {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', require('./routes/api'));

module.exports = app;
