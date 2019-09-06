const expressJwt = require("express-jwt"); // for authorization check

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

// 자기 프로필만 볼 수 있도록! 예를들어 /api/secret/:userId 부분..
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! Access denied"
    });
  }
  next();
};
