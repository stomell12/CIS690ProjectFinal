var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function(req, email, password, done) {
      process.nextTick(function() {
        User.findOne({ 'email': email }).then(user => {
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            var newUser = new User();
            newUser.email = email;
            newUser.password = User.generateHash(password);
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.role = req.body.role;

            newUser.save().then(() => {
              return done(null, newUser);
            }).catch(err => {
              throw err;
            });
          }
        }).catch(err => {
          return done(err);
        });
      });
    }));
  passport.use('admin-create-user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ 'email': email });
        if (user) return done(null, false, req.flash('createUserMessage', 'That email is already taken.'));

        await User.create({
          email: email,
          password: User.generateHash(password),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          role: req.body.role
        });

        return done(null, false);
      } catch (err) {
        return done(err);
      }
    }));


  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function(req, email, password, done) {
      User.findOne({ 'email': email }).then(user => {
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }

        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'ඞps! Wrong password.'));
        }

        return done(null, user);
      }).catch(err => {
        return done(err);
      });
    }));
};
