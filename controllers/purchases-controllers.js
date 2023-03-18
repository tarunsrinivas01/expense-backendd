const razorpay=require('razorpay')
const Order=require('../models/order')
const user=require('../models/user')
const jwt=require('jsonwebtoken')
function generatetoken(id,ispremiumuser)
{
  return jwt.sign({userid:id,ispremiumuser:ispremiumuser},'Tarun@123')
}
exports.purchasepremium=async(req,res,next)=>{
    try {
        const rzp=new razorpay({
            key_id:process.env.key_id,
            key_secret:process.env.key_secret
        })
        const amount=2500;
        rzp.orders.create({amount,currency:'INR'},async(err,order)=>{
            if(err)
            {
                throw new Error(JSON.stringify(err))
            }
            await req.user.createOrder({orderId:order.id,status:'PENDING'})
            // .then(()=>{
                return res.json({order,key_id:rzp.key_id})
            // }).catch(err=>{
            //     throw new Error(err)
            // })
    
    
        })
    } catch (error) {
        throw new Error(error)
    }
}
exports.updatetransaction=async(req,res,next)=>{
    try{
        const {payment_id,order_id}=req.body;
        const order=await Order.findOne({where:{orderId:order_id}})
            const promise1= order.update({paymentId:payment_id,status:'success'})
            const promise2= req.user.update({ispremiumuser:true})
        const results=await Promise.all([promise1,promise2])
        //  .then((results)=>{
             res.status(201).json({success:true,message:'transaction successfull','token':generatetoken(req.user.id,req.user.ispremiumuser)})
        //  })
    }
    catch(err){
        throw new Error(err)
    }
}