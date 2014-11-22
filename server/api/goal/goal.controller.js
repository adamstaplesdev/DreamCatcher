'use strict';

var _ = require('lodash');
var Goal = require('./goal.model');

// Get list of goals
exports.index = function(req, res) {
  Goal.find(function (err, goals) {
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

// Creates a new goal in the DB.
exports.create = function(req, res) {
  Goal.create(req.body, function(err, goal) {
    if(err) { return handleError(res, err); }
    return res.json(201, goal);
  });
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