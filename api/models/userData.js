var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserDataSchema = new Schema({
  uploadDate: Date,
  data: {}
});

module.exports = mongoose.model('UserData', UserDataSchema);
