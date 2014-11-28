'use strict';

var _ = require('lodash');
var Goal = require('./goal.model');
//This next one is necessary for parsing query params
var url = require('url');


// Get list of goals
exports.index = function(req, res) {

  var queryParams = parseQueryParams(req);
  //Because the query params get parsed out as json, we can just hand
  //those straight in as the database query

  Goal.find(queryParams, function (err, goals) {
    if(err) { return handleError(res, err); }
    return res.json(200, goals);
  });
};

// Get a single goal
exports.show = function(req, res) {
  Goal.findById(req.params.id, function (err, goal) {
    if(err) { return handleError(res, err); }
    if(!goal) { return res.send(404); }
    return res.json(goal);
  });
};

// Creates one or more new goals in the DB.
exports.create = function(req, res) {

  var goals = req.body;
  var wasArray = true;
  //first we need to check if it's an array.
  //If it's not, we should make it one
  if (goals.constructor !== Array) {
    wasArray = false;
    goals = [goals];
  }

  //Then we loop through the array and create a new
  //entry in the database for each item in the array
  for (var i = 0; i < goals.length; i++) {
    Goal.create(goals[i], function(err, goal) {
      //if it fails, we should immediately fail and return
      if (err) { return handleError(res, err); }
      //if it works, we should update it with the id
      goals[i] = goal;
    });
  }

  //return an object rather than an array if they sent
  //only an object initially
  if (!wasArray && goals.length == 1)
    return res.json(201, goals[0]);
  //otherwise, just return the array
  return res.json(201, goals);
};

// Updates an existing goal in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Goal.findById(req.params.id, function (err, goal) {
    if (err) { return handleError(res, err); }
    if(!goal) { return res.send(404); }
    var updated = _.merge(goal, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, goal);
    });
  });
};

exports.batchUpdate = function(req, res) {
  //I'll assume that it will never get set to this
  //url unless it's a url
  var goals = req.body;
  for (var i = 0; i < goals.length; i++) {
    Goal.findById(goals[i].id, function(err, goal) {
      if (err) { return handleerror(res, err); }
      if (!goal) { return res.send(404); }
      var updated = _.merge(goal, goals[i]);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        goals[i] = goal;
      })
    })
  }
  return res.json(201, goals);
}

// Deletes a goal from the DB.
exports.destroy = function(req, res) {
  Goal.findById(req.params.id, function (err, goal) {
    if(err) { return handleError(res, err); }
    if(!goal) { return res.send(404); }
    goal.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function parseQueryParams(req) {
  //parse out the query params
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log("Query params on request: ", query);
  return query;
}