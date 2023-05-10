// Copied from example code, relocate this or change how we are using index.ejs in views?

var express = require('express');
var router = express.Router();
const patientController = require('../controllers/patientController.js')
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.ensureAuthenticated, function(req, res, next) {
  patientController.getall(req, res);
});

router.get('/create', authMiddleware.ensureAuthenticated, function(req, res, next) {
  res.render('create');
});

router.get('/update', authMiddleware.ensureAuthenticated, function(req, res, next) {
  patientController.update_get(req, res);
});

router.post('/update', authMiddleware.ensureAuthenticated, function(req, res, next) {
  patientController.update(req, res);
});

router.get('/delete', authMiddleware.ensureAuthenticated, function(req, res, next) {
  patientController.delete(req, res);
});

module.exports = router;
