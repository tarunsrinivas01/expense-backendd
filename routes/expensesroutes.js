const express=require('express')

const Router=express.Router();

const expensecontrollers=require('../controllers/expense-controllers')
const auth=require('../middleware/authentication')



Router.post('/add-expenses',auth.authentication,expensecontrollers.addexpenses)
Router.get('/getall',auth.authentication,expensecontrollers.getexpenses)
Router.delete('/delete/:id',auth.authentication,expensecontrollers.deleteexpenses)
Router.put('/add-expenses/:id',auth.authentication,expensecontrollers.editexpenses)
Router.get('/downloadedfiles',auth.authentication,expensecontrollers.files)

module.exports=Router