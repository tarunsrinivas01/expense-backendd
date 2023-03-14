const express=require('express')

const Router=express.Router();

const expensecontrollers=require('../controllers/expense-controllers')



Router.post('/add-expenses',expensecontrollers.addexpenses)
Router.get('/getall',expensecontrollers.getexpenses)
Router.delete('/delete/:id',expensecontrollers.deleteexpenses)
Router.put('/add-expenses/:id',expensecontrollers.editexpenses)

module.exports=Router