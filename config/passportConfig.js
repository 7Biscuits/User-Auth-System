const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async function (username, password, done) {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Invalid Username" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) return done(null, user);
        else return done(null, false, { message: "Invalid Password" });
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    const user = await User.findById(id);
    cb(null, user.id);
  });
};
