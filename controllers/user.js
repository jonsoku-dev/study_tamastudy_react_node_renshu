const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User is not found"
      });
    }
    req.profile = user;
    next();
  });
};

exports.getSecretProfile = (req, res) => {
  res.json({
    user: req.profile
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true }
    ).select("-hashed_password -salt");
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error!");
  }
};
