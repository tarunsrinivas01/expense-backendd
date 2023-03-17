const sequelize=require('../database/db')
const express=require('express')
const controllers=require('../controllers/forgot-controllers')
const auth=require('../middleware/authentication')
const Router=express.Router()


Router.post('/forgotpassword',controllers.forgotpassword)
Router.get('/resetpassword/:id',controllers.resetpassword)
Router.get('/updatepassword/:id',controllers.updatepassword)

module.exports=Router