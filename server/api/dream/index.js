'use strict';

var express = require('express');
var controller = require('./dream.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//custom endpoint to get the user's categories
router.get('/categories', controller.categories);

//and now we just have the standard CRUD operations
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;