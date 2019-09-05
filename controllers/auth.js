const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); // to generate signed token

exports.signup = async (req, res) => {
  /* validator */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    // user check
    if (user) {
      return res.status(400).json({ errors: [{ msg: "user already exists!" }] });
    }
    user = new User({
      name,
      email,
      password
    });
    // save user
    await user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          err: errorHandler(err)
        });
      }
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({ user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error!");
  }
};

exports.signin = async (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    // user check
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "user dosen't exists, please signup" }] });
    }
    // if user found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({ errors: [{ msg: "Password is not match" }] });
    }
    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, role } = user;
    res.json({ token, user: { _id, email, name, role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error!");
  }
};

exports.signout = async (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success!" });
};
