const express=require('express')
const app=express();
const Router=express.Router();
const premiumcontrollers=require('../controllers/premium-features')
const auth=require('../middleware/authentication')

Router.get('/leaderboard',auth.authentication,premiumcontrollers.gettheleaderboard)

module.exports=Router