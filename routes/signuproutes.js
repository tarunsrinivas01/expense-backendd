const sequelize=require('../database/db')
const express=require('express')
const controllers=require('../controllers/signup')
const Router=express.Router()

Router.post('/signup',controllers.signup)

module.exports=Router