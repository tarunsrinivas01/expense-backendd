const sequelize=require('../database/db')
const express=require('express')
const controllers=require('../controllers/usercontrollers')
const expcontrollers=require('../controllers/expense-controllers')
const auth=require('../middleware/authentication')
const Router=express.Router()

Router.post('/signup',controllers.signup)
Router.post('/login',controllers.login)
Router.get('/download',auth.authentication,expcontrollers.downloadexpenses)
// Router.post('/')

module.exports=Router