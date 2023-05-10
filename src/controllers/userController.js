const User = require('../models/userModel');
const passport = require('passport');

exports.createUser = function(req, res, next) {
  passport.authenticate('admin-create-user', function(err, user, info) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      req.flash('createUserMessage', info.message);
      return res.redirect('/dashboard/userList');
    }
    res.redirect('/dashboard/userList');
  })(req, res, next);
};

exports.getall = async function(req, res) {
  try {
    var returnedUser = await User.find({});
    console.log(returnedUser);
    res.render('./dashboard/userList', { user: returnedUser, loggedInUser: req.user });
  } catch (err) {
    console.log(err);
  }
};

exports.delete = async function(req, res) {
  const deletedUser = await User.findOneAndDelete({ _id: req.query.id });
  console.log("Deleted User:", deletedUser);
  res.redirect('/dashboard/userList');
};

exports.update = async function(req, res) {
  req.body.password = User.generateHash(req.body.password);
  const updatedUser = await User.findOneAndUpdate({ _id: req.query.id }, { $set: req.body }, { new: true });
  console.log("Updated user:", updatedUser);
  res.redirect('/dashboard/userList');
};

exports.showUpdateForm = async function(req, res) {
  const user = await User.findById(req.query.id);
  console.log("User data:", user.toObject());
  res.render('users/updateUser', { user: user.toObject(), loggedInUser: req.user });
};
