# npm install

```bash
$ npm install cookie-parser body-parser morgan
```

# app.js

```javascript
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

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

// routes
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

# routes/user.js

```javascript
const express = require("express");
const router = express.Router();
// controllers
const { signup } = require("../controllers/user");

router.post("/signup", signup);

module.exports = router;
```

# controllers/user.js

```javascript
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
```
