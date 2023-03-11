var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('dashboard/list');
});

router.get('/detail', function (req, res, next) {
  res.render('dashboard/detail');
});

module.exports = router;
