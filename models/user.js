const Sequelize=require('sequelize')

const sequelize=require('../database/db')

const user=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowedNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowedNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowedNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowedNull:false
    }
})
module.exports=user