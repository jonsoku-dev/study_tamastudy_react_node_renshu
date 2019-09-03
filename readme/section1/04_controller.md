# controllers folder

```bash
$ mkdir controllers
```

# create a files

```bash
$ touch controllers/user.js
```

# controllers/user.js

```javascript
exports.sayHi = (req, res) => {
  res.json({ message: "Hello there!" });
};
```

# routes/user.js

```javascript
const express = require("express");
const router = express.Router();
// controllers
const { sayHi } = require("../controllers/user");

router.get("/", sayHi);

module.exports = router;
```

# browser

localhost:8000/api

# json 출력이 되면 정상
