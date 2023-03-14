const express = require("express");
const bodyParser = require("body-parser");
const user = require("../models/user");
const e = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function isstringvalidate(string)
{
    if(string==undefined || string.length===0)return true;
    return false;
}
exports.signup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name);
    if(isstringvalidate(name)|| isstringvalidate(email)|| isstringvalidate(password))
    {
        return res.status(401).json({err:'something is missing'})
    }

    await user.create({ name, email, password });
    res
      .status(201)
      .json({ message: "successfully new user created", success: "true" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
exports.login=async(req,res,next)=>{
  try {
    const {email,password}=req.body
    const users=await user.findAll({where:{email:email}})
    // console.log(users)
    if(users.length>0)
    {
      if(users[0].password==password)
      {
        return res.status(201).json({message:'user logged in succesfully',success:'true'})
      }
      else{
        return res.status(401).json({message:'User not authorized',success:'false'})
      }
    }
    else{
      return res.status(500).json({message:'user not found',message:'false'})
    }
  } catch (error) {
    console.log(error)
  }
}