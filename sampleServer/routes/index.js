var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile(path.join('views','index.html'));
});

module.exports = router;
