const express = require("express");
const app = express();
const sequelize = require("./database/db");
const signuproutes = require("./routes/userroutes");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
console.log("entered");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", signuproutes);

sequelize
  .sync()
  .then(app.listen(3000))
  .catch((err) => console.log(err));
