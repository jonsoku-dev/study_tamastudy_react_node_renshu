const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// controllers
const { signup, signin, signout, registry } = require("../controllers/auth");
const { requireSignin } = require("../middleware/auth");
//const { userSignupValidator } = require("../validator");

router.post(
  "/signup",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Email must be between 3 to 32 characters")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({ min: 4, max: 32 }),
    check("password", "Password is required")
      .not()
      .isEmpty(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
  ],
  signup
);

router.post(
  "/registry",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Email must be between 3 to 32 characters")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({ min: 4, max: 32 }),
    check("password", "Password is required")
      .not()
      .isEmpty(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number")
  ],
  registry
);

router.post("/signin", signin);
router.get("/signout", signout);

// how to use middleware (example)
router.get("/hello", requireSignin, (req, res) => {
  res.send("hello there");
});

module.exports = router;
