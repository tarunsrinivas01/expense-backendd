const razorpay=require('razorpay')
const Order=require('../models/order')
const user=require('../models/user')
const jwt=require('jsonwebtoken')

exports.purchasepremium=(req,res,next)=>{
    const rzp=new razorpay({
        key_id:'rzp_test_kql2Cff2HM8dQb',
        key_secret:'vz1yxbY7ZPokXXTkiag4SPqj'
    })
    const amount=2500;
    rzp.orders.create({amount,currency:'INR'},(err,order)=>{
        if(err)
        {
            throw new Error(JSON.stringify(err))
        }
        req.user.createOrder({orderId:order.id,status:'PENDING'})
        .then(()=>{
            return res.json({order,key_id:rzp.key_id})
        }).catch(err=>{
            throw new Error(err)
        })


    })
}
exports.updatetransaction=async(req,res,next)=>{
    try{
        const {payment_id,order_id}=req.body;
        const order=await Order.findOne({where:{orderId:order_id}})
            const promise1= order.update({paymentId:payment_id,status:'success'})
            const promise2= req.user.update({ispremiumuser:true})
         Promise.all([promise1,promise2])
         .then((results)=>{
             res.status(201).json({success:true,message:'transaction successfull'})
         })
    }
    catch(err){
        throw new Error(err)
    }
}