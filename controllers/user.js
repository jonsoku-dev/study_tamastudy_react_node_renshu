const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "user already exists!" }] });
    }
    user = new User({
      name,
      email,
      password
    });
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
