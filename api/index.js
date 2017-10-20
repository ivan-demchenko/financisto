var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('financisto:api');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongodb:27017/financisto', {
    useMongoClient: true
}).then(
    () => debug('Connected to data base'),
    (err) => debug('ERROR: Connected was not established', err)
)

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', require('./routes/api'));

module.exports = app;
