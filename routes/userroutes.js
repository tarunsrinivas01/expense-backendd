const sequelize=require('../database/db')
const express=require('express')
const controllers=require('../controllers/usercontrollers')
const Router=express.Router()

Router.post('/signup',controllers.signup)
Router.post('/login',controllers.login)

module.exports=Router