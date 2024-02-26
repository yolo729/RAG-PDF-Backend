const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const User = require('../../../models/UserSchema');


const forgetPassword = async (req, res) => {
    const email = req.body.email

    if (!email) {
        return res.status(400).send("invalid payload..")
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send("user not found.")
        }
        const payload = { id: user.id, email, type: "forgot_password" };
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        // const transporter = nodemailer.createTransport({
        //     service: 'myservice',
        //     auth: {
        //       user: 'youremail@gmail.com',
        //       pass: 'your password'
        //     }
        //   });


        //   const info = await transporter.sendMail({
        //     from: "sender@gmail.com",
        //     to: user.email,
        //     subject: "Forgot Password",
        //     text:`http://localhost:3000/reset_password?token=${token}`,
        //   });


        //   transporter.sendMail(info, function(error, info){
        //     if (error) {
        //       console.log(error);
        //       res.status(400).send(error)
        //     }
        //      else {
        //       console.log('Email sent: ' + info.response);
        //       res.status(200).send('Email sent'+info.response)
        //     }
        //   });

        res.status(200).send(`an email with rest password link has been sent to your registered email address.${token},${user.email}`)
    }

    catch (error) {
        res.status(400).send(error)
    }





};


module.exports = forgetPassword;