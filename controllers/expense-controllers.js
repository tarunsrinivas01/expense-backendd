const { where } = require('sequelize');
const exp=require('../models/expense')

exports.addexpenses=async(req,res,next)=>
{
    try{
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.choosecategory;
    console.log('id>>>>>>>>',req.user.id)
    if(amount===undefined|| amount.length===0||description===undefined||description.length===0||category===undefined||category.length===0)
    {
        return res.status(401).json({message:'parameters are missing'})
    }
    const data=await exp.create({amount:amount,description:description,category:category,userId:req.user.id})
    res.status(201).json({newexpenses:data})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({message:err,success:'false'})
    } 
}
exports.getexpenses=async(req,res,next)=>{
    try{
        const data=await exp.findAll({where:{userId:req.user.id}})
        res.status(200).json({allexpenses:data})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({message:err,success:'false'})
    }
}
exports.deleteexpenses=async(req,res,next)=>{
    try{
        const expid=req.params.id
        const response=await exp.destroy({where:{id:expid,userId:req.user.id}})
        if(response===0)
        {
            res.status(401).json({message:'no expense found',success:'false'})
        }
        else{
            res.status(200).json({message:'expense deleted',success:'true'})
        }
       
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err,success:'false'})
    }
}
exports.editexpenses = async (req, res, next) => {
    try {
        const expid = req.params.id;
        if (!expid) {
            return res.status(400).json({ message: "Invalid request parameter" });
        }
        const editexpense = await exp.findAll({
            where: { id: expid, userId: req.user.id }
        });
        if (editexpense.length > 0) {
            editexpense[0].amount = req.body.amount || editexpense[0].amount;
            editexpense[0].description = req.body.description || editexpense[0].description;
            editexpense[0].category = req.body.choosecategory || editexpense[0].category;
            await editexpense[0].save();
            console.log(editexpense);
            res.status(200).json({ newexpenses: editexpense[0] });
        } else {
            res.status(404).json({ message: "Expense not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
