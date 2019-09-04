# helpers, validator 따로 만들었는데 아직 작동이안됨..

그래서 그냥... router에서 체크하고, controller에서 에러메시지띄우는방식으로 진행함

## app.js

app.js 에서 expressValidator를 불러오는 부분을 주석처리했다.

```javascript
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const expressValidator = require("express-validator");

require("dotenv").config();
// import routes
const userRoutes = require("./routes/user");

// app
const app = express();

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("DB Connected"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(expressValidator());

// routes
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## controllers/user.js

```javascript
const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { validationResult } = require("express-validator");

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
```

## routes/user.js

```javascript
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// controllers
const { signup } = require("../controllers/user");
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

module.exports = router;
```

# legacy ... validator/index.js

이렇게 validator만 따로 떼어낼 수 있으면 좋을 것 같은데... 일단 안되니까 패스

```javascript
exports.userSignupValidator = (req, res, next) => {
  req
    .check("name", "Name is required")
    .not()
    .isEmpty();
  req
    .check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({ min: 4, max: 32 });
  req
    .check("password", "Password is required")
    .not()
    .isEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({ errors: errors });
  }
  next();
};
```
