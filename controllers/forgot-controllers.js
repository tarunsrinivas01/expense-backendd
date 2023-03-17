const sgMail = require("@sendgrid/mail");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Forgotpassword = require("../models/forgot-pass");
// const express
// const app=
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

exports.forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const id = uuid.v4();
      console.log(id);
      await user.createForgotpassword({ id, active: true });
      // .catch(err=>{
      //     throw new Error(err)
      // })
      sgMail.setApiKey(
        "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"
      );

      const msg = {
        to: email, // Change to your recipient
        from: "gadipuditarun@gmail.com", // Change to your verified sender
        subject: "Sending with SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      };

      const response = await sgMail.send(msg);
      // console.log(response[0].statusCode)
      // console.log(response[0].headers)
      return res
        .status(response[0].statusCode)
        .json({
          message: "Link to reset password sent to your mail ",
          success: true,
        });

      //send mail
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (error) {
    console.log(error);
  }
};
exports.resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
  const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });
  if (forgotpasswordrequest) {
    forgotpasswordrequest.update({ active: false });
    res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
    res.end();
  }
  } catch (error) {
    throw new Error(error)
  }
};
exports.updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { id } = req.params;
    const resetpasswordrequest = await Forgotpassword.findOne({
      where: { id: id },
    });
    const user = User.findOne({ where: { id: resetpasswordrequest.userId } });
    // console.log('userDetails', user)
    if (user) {
      //encrypt the password

      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        bcrypt.hash(newpassword, salt, async function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          const res = await user.update({ password: hash });
          res
            .status(201)
            .json({ message: "Successfuly update the new password" });
        });
      });
    } else {
      return res.status(404).json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};
