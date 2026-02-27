const passport = require("passport");

const setupAuth = (app) => {
  // Passport configuration
  require("./passport")(passport);
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Global middleware for user and flash messages
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
  });
};

module.exports = setupAuth;
