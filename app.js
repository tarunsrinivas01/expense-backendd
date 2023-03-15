const express = require("express");
const app = express();
const sequelize = require("./database/db");
//requiring routes
const userroutes = require("./routes/userroutes");
const expenseroutes=require('./routes/expensesroutes')
const purchaseroutes=require('./routes/premiumroutes')

// requiring models
const user=require('./models/user')
const expense=require('./models/expense')
const order=require('./models/order')

// bodyparser and cors
const bodyParser = require("body-parser");
const cors = require("cors");

// middlewares
app.use(cors());
console.log("entered");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// using routes
app.use("/user", userroutes);
app.use('/expenses',expenseroutes)
app.use('/premium',purchaseroutes)

// relations
user.hasMany(expense)
expense.belongsTo(user)

user.hasMany(order)
order.belongsTo(user)

sequelize
  .sync()
  .then(app.listen(3000))
  .catch((err) => console.log(err));
