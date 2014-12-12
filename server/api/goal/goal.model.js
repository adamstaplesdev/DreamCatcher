'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GoalSchema = new Schema({
  name: String,
  type: String,
  description: String,
  deadline: Boolean,
  startDate: Date,
  endDate: Date,
  habit: Boolean,
  frequency: {
    monthly: Array,
    weekly: Array,
    daily: Array
  },
  quantitative: Boolean,
  amount: Number,
  progress: Number,
  progressType: String,
  reminders: {
  	monthly: Array,
  	weekly: Array,
  	daily: Array 
  },
  //And now the two fields for the parent identification
  parentId: String,
  parentType: String,
  userId: String
});

module.exports = mongoose.model('Goal', GoalSchema);

/*
	I figured that it would be a good idea to document the reminders
	structure somehow, so this is where I decided to do it.
	Basically, the user has the following options for reminders

  This is, incidentally, also the structure for frequency

	Daily
		Time of day

	Weekly
		Days
			Time of day

	Monthly
		Dates
			Time of day
*/