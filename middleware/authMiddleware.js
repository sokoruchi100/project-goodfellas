// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.error("User is not authenticated.");
    return res.status(401).send("User is not authenticated.");
  }
};

module.exports = { ensureAuthenticated };
