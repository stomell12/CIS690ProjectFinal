let passport = require('passport');
var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated, roleAuthorization } = require('../middleware/auth');

router.get('/list', ensureAuthenticated, roleAuthorization(['Admin']), userController.getall);
router.get('/delete', ensureAuthenticated, roleAuthorization(['Admin']), userController.delete);

router.get(['/login', '/'], function(req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res, next) {
  res.render('account/signup', { message: req.flash('message') });
});

router.get('/createUser', ensureAuthenticated, roleAuthorization(['Admin']), function(req, res, next) {
  res.render('users/createUser', { message: req.flash('message'), user: req.user, loggedInUser: req.user });
});

router.get('/myAccount', ensureAuthenticated, function(req, res, next) {
  res.render('account/myAccount', { user: req.user, loggedInUser: req.user });
});

router.post('/createUser', ensureAuthenticated, roleAuthorization(['Admin']), (req, res, next) => {
  passport.authenticate('admin-create-user', (err, user, info) => {
    if (user === false) {
      req.flash('message', info.message);
      res.redirect('/account/createUser');
    } else {
      res.redirect('/dashboard/userList');
    }
  })(req, res, next);
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/dashboard',
  failureRedirect: '/account/login',
  failureFlash: true
}), function(req, res) {
  console.log('User:', req.user.email, 'logged in');
});

router.get('/logout', function(req, res, next) {
  console.log('User:', req.user.email, 'logged out');
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/dashboard/userList',
  failureRedirect: '/account/signup',
}));

router.get('/update', ensureAuthenticated, userController.showUpdateForm);
router.post('/update', ensureAuthenticated, userController.update);

module.exports = router;
