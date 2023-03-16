const sgMail=require('@sendgrid/mail')
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User=require('../models/user')
const Forgotpassword=require('../models/forgot-pass-define');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


exports.forgotpassword=await(req,res,next)=>{
    const { email } =  req.body;
    const user = await User.findOne({where : { email }});
     
    if(user){
    sgMail.setApiKey('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')

    const msg = {
        to: email, // Change to your recipient
        from: 'gadipuditarun@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
    }

    sgMail
    .send(msg)
    .then((response) => {

        // console.log(response[0].statusCode)
        // console.log(response[0].headers)
        return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})

    })
    .catch((error) => {
        throw new Error(error);
    })

    //send mail
}else {
    throw new Error('User doesnt exist')
}
}

