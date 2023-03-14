const exp=require('../models/expense')

exports.addexpenses=async(req,res,next)=>
{
    try{
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.choosecategory;
    if(amount===undefined|| amount.length===0||description===undefined||description.length===0||category===undefined||category.length===0)
    {
        return res.status(401).json({message:'parameters are missing'})
    }
    const data=await exp.create({amount:amount,description:description,category:category})
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
        const data=await exp.findAll()
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
        const response=await exp.destroy({where:{id:expid}})
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
exports.editexpenses=async(req,res,next)=>{
    try {
        const expid = req.params.id
        // console.log(expid)
        const editexpense = await exp.findByPk(expid)
        // console.log(editexpense)
        if (editexpense) {
            editexpense.amount = req.body.amount
            editexpense.description = req.body.description
            editexpense.category = req.body.choosecategory
            await editexpense.save()
            console.log(editexpense)
            res.status(200).json({ newexpenses: editexpense })
        } else {
            res.status(404).json({ message: "Expense not found" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}
