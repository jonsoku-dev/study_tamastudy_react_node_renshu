# setting

```bash
$ touch .gitignore app.js readme.md .env
```

# .gitignore

```
node_modules
.env
```

# npm init

```bash
$ npm init -y
```

# third party install

```bash
$ npm install express dotenv nodemon
```

# .env

```bash
PORT=8000
```

# package.json script 추가

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon app.js"
  },
```

# app.js

```javascript
const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello from tamastudy");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```
