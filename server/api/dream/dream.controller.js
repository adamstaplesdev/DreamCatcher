'use strict';

var _ = require('lodash');
var Dream = require('./dream.model');

//Custom endpoint - get user's dream categories
exports.categories = function(req, res) {
  if (!req.user) { return res.send(401); }
  Dream.find( { 'userId': req.user._id }, function(err, dreams) {
    if (err) { return handleError(res, err); }
    var categories = [];
    for (var i = 0; i < dreams.length; i++) {
      if (dreams[i].category && categories.indexOf(dreams[i].category == -1)) {
        categories.push(dreams[i].category);
      }
    }
    return res.json(200, categories);
  });
}


// Get list of dreams
exports.index = function(req, res) {
  if (!req.user) return res.send(401);
  Dream.find( { 'userId': req.user._id }, function (err, dreams) {
    if(err) { return handleError(res, err); }
    return res.json(200, dreams);
  });
};

// Get a single dream
exports.show = function(req, res) {
  Dream.findById(req.params.id, function (err, dream) {
    if(err) { return handleError(res, err); }
    if(!dream) { return res.send(404); }
    if(dream.userId != req.user._id) { return res.send(401); }
    return res.json(dream);
  });
};

// Creates a new dream in the DB.
exports.create = function(req, res) {
  req.body.userId = req.user._id;
  Dream.create(req.body, function(err, dream) {
    if(err) { return handleError(res, err); }
    console.log('The dream that was created:', dream);
    return res.json(201, dream);
  });
};

// Updates an existing dream in the DB.
exports.update = function(req, res) {
  if (!req.user || !req.body | req.user._id != req.body.userId)
    return res.send(401);
  if(req.body._id) { delete req.body._id; }
  Dream.findById(req.params.id, function (err, dream) {
    if (err) { return handleError(res, err); }
    if(!dream) { return res.send(404); }
    var updated = _.merge(dream, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, dream);
    });
  });
};

// Deletes a dream from the DB.
exports.destroy = function(req, res) {
  Dream.findById(req.params.id, function (err, dream) {
    if(err) { return handleError(res, err); }
    if(!dream) { return res.send(404); }
    if (!req.user || req.user._id != dream.userId) { return res.send(401); }
    dream.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}