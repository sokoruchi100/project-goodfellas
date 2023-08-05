// Middleware to check if the user is authenticated

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.error("User is not authenticated.");
    return res.redirect("/");
  }
};

const ensureNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    console.error("User is authenticated.");
    return res.redirect("/dashboard");
  }
};

module.exports = { ensureAuthenticated, ensureNotAuthenticated };
