var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserData = new Schema({
    data: {}
});

module.exports = mongoose.model('UserData', UserData);