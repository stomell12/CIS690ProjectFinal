var express = require('express');
var router = express.Router();
const patients = require('../controllers/patientController');
const users = require('../controllers/userController');
const { ensureAuthenticated, roleAuthorization } = require('../middleware/auth');

router.get('/list', ensureAuthenticated, patients.getall);
router.get('/userList', ensureAuthenticated, roleAuthorization(['Admin']), users.getall);

router.get('/', ensureAuthenticated, function(req, res, next) {
  console.log('Redirecting to /dashboard/list');
  res.redirect('/dashboard/list');
});

module.exports = router;
