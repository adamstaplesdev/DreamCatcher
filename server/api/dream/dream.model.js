'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DreamSchema = new Schema({
  name: String,
  category: String,
  description: String,

  //does this dream have a deadline or not?
  deadline: Boolean,

  //if it does, what are the start and end dates?
  startDate: Date,
  endDate: Date,

  //this is just so we can mark stuff as completed, etc
  status: String
});

module.exports = mongoose.model('Dream', DreamSchema);