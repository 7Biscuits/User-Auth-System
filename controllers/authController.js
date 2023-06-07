const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/UserModel");

const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

const signinSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

const signup = async (req, res) => {
  const { error } = await signupSchema.validateAsync(req.body);
  if (error) return res.send(error.details[0].message);

  const { username, password } = req.body;

  if (await User.findOne({ username: username }))
    return res.status(400).send("Username already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username: username,
    password: hashedPassword,
  });

  try {
    await user.save().then(() => res.send("Sign up successful"));
  } catch (err) {
    res.send(err.message);
  }
};

const signout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("userid");
    res.send("Sign out successful");
  });
};

module.exports = {
  signup,
  signinSchema,
  signout
};