const jwt=require('jsonwebtoken')
const User=require('../models/user')


exports.authentication=(req,res,next)=>{
   try {
    const token=req.header('Authorisation')
    const user=jwt.verify(token,'Tarun@123')
    console.log(user)
    User.findByPk(user.userid)
    .then(user=>{
        req.user=user
        next()
    })
   } catch (error) {
    console.log(error)
    res.status(401).json({message:error})
   }
}