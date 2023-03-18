const sequelize=require('../database/db')
const exp=require('../models/expense')
const user=require('../models/user')
const Expense=require('../models/expense')
const Downloadfile=require('../models/files')
const AWS=require('aws-sdk')

exports.addexpenses=async(req,res,next)=>
{    const t=await sequelize.transaction()
    try{
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.choosecategory;

    console.log('id>>>>>>>>',req.user.id)
    if(amount===undefined|| amount.length===0||description===undefined||description.length===0||category===undefined||category.length===0)
    {
        return res.status(401).json({message:'parameters are missing'})
    }
    const data=await exp.create({amount:amount,description:description,category:category,userId:req.user.id},{transaction:t})
    const totalexpenses=Number(req.user.total_expenses)+Number(amount)
    await user.update({total_expenses:totalexpenses},{where:{id:req.user.id},transaction:t})
    await t.commit()
    res.status(201).json({newexpenses:data})
    }
    catch(err)
    {
        await t.rollback()
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
        const delexpense=exp.findByPk(expid)
        const delamount=delexpense.amount;
        const response=await exp.destroy({where:{id:expid,userId:req.user.id}})
        if(response===0)
        {   
            
            res.status(401).json({message:'no expense found',success:'false'})
        }
        else{
            const totalexpenses=Number(req.user.total_expenses)-Number(delamount)
            req.user.update({total_expenses:totalexpenses},{where:{id:req.user.id}})
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
function uploadtoS3(data,filename)
{
  const BUCKET_NAME='expensetracker1'
  const IAM_USER_KEY='AKIAYQF6SJQJ26LSJ6UW'
  const IAM_USER_SECRET='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'

  let s3Bucket=new AWS.S3({
    accessKeyId:IAM_USER_KEY,
    secretAccessKey:IAM_USER_SECRET,
    
  })

    var params={
      Bucket:BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params,(err,s3response)=>{
            if(err)
            {
              console.log(err)
              reject(err)
            }
            else{
              console.log('success',s3response)
              resolve(s3response.Location)
            }
          })
    })
    
}

exports.downloadexpenses=async(req,res,next)=>{
    try {
        const id=req.user.id
  const expense=await Expense.findAll({where:{userId:id}})
  const stringifiedexpenses=JSON.stringify(expense)
  const filename=`expenses${id}/${new Date()}.txt`
  const fileUrl=await uploadtoS3(stringifiedexpenses,filename)
  await Downloadfile.create({url:fileUrl,userId:id});
  res.status(201).json({fileUrl,success:'true'})
    } catch (error) {
        console.log(error)
        res.status(401).json({fileUrl:'',success:'false',err:error})
    }
    
}
exports.files=async(req,res,next)=>{
    try {
        const id=req.user.id

        const files=await Downloadfile.findAll({where:{userId:id}})
        // if(files.length>0)
        // {
            console.log(files.url)
            res.status(201).json({files:files,message:'success'})
        // }
    } catch (error) {
        res.status(401).json({err:'no files found'})
    }
}