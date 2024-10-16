const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

app.get("/api", (req, res) => {
  console.log("ko");
  res.json({ users: ["userOne", "userTwo", "userThree", "userFour"] });
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
