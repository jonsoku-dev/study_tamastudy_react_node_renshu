# controllers/user.js

```javascript
/* confirm token middleware */
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
```

# routes/user.js

```javascript
...

const { signup, signin, signout, requireSignin } = require("../controllers/user");

...

// how to use middleware (example)
router.get("/hello", requireSignin, (req, res) => {
  res.send("hello there");
});

module.exports = router;

```
