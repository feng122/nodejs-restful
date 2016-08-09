var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user_name: String,
  password: String,
  phone_number: String,
  city_name: String,
  town_name: String,
  photo_url: String,
  welcome_message: String,
  created_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);