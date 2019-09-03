# altas

https://cloud.mongodb.com/v2/5ce73a12014b761dcc9cfb59#metrics/replicaSet/5ce73b5855385502ddbbde79/explorer

# connect

# .env

```env
PORT=8000

MONGO_URI=mongodb+srv://the2792:<password>@devconnector-jy5dk.mongodb.net/test?retryWrites=true&w=majority

```

# mongoose

```bash
$ npm i mongoose
```

# app.js

```javascript
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

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
app.get("/", (req, res) => {
  res.send("Hello from tamastudy");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```
