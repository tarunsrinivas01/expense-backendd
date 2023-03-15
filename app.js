const express = require("express");
const app = express();
const sequelize = require("./database/db");
const userroutes = require("./routes/userroutes");
const expenseroutes=require('./routes/expensesroutes')
const bodyParser = require("body-parser");
const user=require('./models/user')
const expense=require('./models/expense')
const cors = require("cors");
app.use(cors());
console.log("entered");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", userroutes);
app.use('/expenses',expenseroutes)

user.hasMany(expense)
expense.belongsTo(user)

sequelize
  .sync()
  .then(app.listen(3000))
  .catch((err) => console.log(err));
