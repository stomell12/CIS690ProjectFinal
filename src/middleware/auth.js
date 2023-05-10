function ensureAuthenticated(req, res, next) {
  // if user is authenticated in the session continue
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    return next();
  }
  // if they aren't redirect them to the login
  res.redirect('/account/login');
}

function roleAuthorization(allowedRoles) {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      const userRole = req.user.role;
      if (allowedRoles.includes(userRole)) {
        return next();
      }
    }
    res.status(403).send("Forbidden: Your account role doesn't have access to this page.");
  };
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  roleAuthorization: roleAuthorization,
};
