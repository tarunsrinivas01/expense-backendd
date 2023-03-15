
const express=require('express')
const app=express();
const Router=express.Router();
const purchases=require('../controllers/purchases-controllers')
const auth=require('../middleware/authentication')

Router.get('/premiummembership',auth.authentication,purchases.purchasepremium)
Router.post('/updatetransactionstatus',auth.authentication,purchases.updatetransaction)

module.exports=Router
