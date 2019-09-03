# routes folder

```bash
$ mkdir routes
```

# create a files

```bash
$ touch routes/user.js
```

# user.js

```javascript
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from node!");
});

module.exports = router;
```

# app.js

```javascript
const express = require("express");
const mongoose = require("mongoose");
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

// routes
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

# browser

localhost:8000/api
