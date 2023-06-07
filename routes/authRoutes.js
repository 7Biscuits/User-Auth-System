const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { isSignedIn } = require("../middlewares/authVerify");

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
    })
  })
);

router.use(passport.initialize());
router.use(passport.session());

require("../config/passportConfig")(passport);

const { signup, signout } = require("../controllers/authController");

router.route("/signup").post(signup);

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) res.send(info.message);
    else {
      req.login(user, (err) => {
        if (err) return next(err);
        res.cookie("userid", user.id, { maxAge: 2592000000 });
        return res.send("Login successful");
      });
    }
  })(req, res, next);
});

router.route("/signout", isSignedIn).post(signout);

router.get("/protected", isSignedIn, (req, res) => {
  res.send("This is a protected route");
});

module.exports = router;
