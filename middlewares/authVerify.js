module.exports.isSignedIn = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else {
    return res.send("You aren't signed in");
  }
};