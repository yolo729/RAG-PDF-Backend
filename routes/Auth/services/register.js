const User = require("../../../models/UserSchema");
const Userquery = require("../../../models/UserQuery");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const CryptoJS = require("crypto-js");
const Prompt = require("../../../models/Prompt");
const { activePrompt, allPrompts } = require("../../../prompts");

const Register = async (req, res) => {
  const { firstName, lastName, email, mobile_no, password, confirmPassword } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobile_no ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ error: "Invalid Payload" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== confirmPassword) {
      res
        .status(400)
        .json({ error: "Password and Confirm password must be same" });
    } else {
      const finalUser = new User({
        firstName,
        lastName,
        email,
        mobile_no,
        password,
      });
      // Password Hashing
      const token = jwt.sign({ _id: finalUser._id }, process.env.JWT_SECRET);
      const storeData = await finalUser.save();
      const userQueryData = new Userquery({
        user_id: storeData._id,
        activePrompt,
      });
      await userQueryData.save();
      const result = {
        _id: storeData._id,
        firstName,
        lastName,
        email,
        mobile_no,
        token,
      };

      res.status(200).json(result);
    }
  } catch (error) {
    res.status(501).json(error);
    console.log("catch block error", error);
  }
};

module.exports = Register;
