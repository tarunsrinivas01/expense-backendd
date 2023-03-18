const Sequelize=require('sequelize');

const sequelize=require('../database/db');

const DownloadedFiles = sequelize.define('downloadedfile',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    url:Sequelize.STRING
})
 module.exports=DownloadedFiles;