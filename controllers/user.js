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
