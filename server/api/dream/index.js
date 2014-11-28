'use strict';

var express = require('express');
var controller = require('./dream.controller');

var router = express.Router();

//custom endpoint to get the user's categories
router.get('/categories', controller.categories);

//and now we just have the standard CRUD operations
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;