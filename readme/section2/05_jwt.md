# npm install

```bash
$ npm i express-jwt jsonwebtoken
```

# routes/user.js

```javascript
...

router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;

```

# models/user.js

```javascript
...

userSchema.methods = {
  authenticate: function(plainText) {
    //true or false
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  ...

};

module.exports = mongoose.model("User", userSchema);

```

# controllers/user.js

```javascript

...

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

```
