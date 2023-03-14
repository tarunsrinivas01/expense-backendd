const Sequelize=require('sequelize')

const sequelize=require('../database/db')

const Expense=sequelize.define('exps',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowedNull:false,
        primaryKey:true
    },
    amount:{
        type:Sequelize.STRING
    },
    description:{
        type:Sequelize.STRING
    },
    category:{
        type:Sequelize.STRING
    }
})
module.exports=Expense