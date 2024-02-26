const User = require("../../../models/UserSchema");
const Userquery = require("../../../models/UserQuery");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { activePrompt } = require("../../../prompts");

const GoogleRegister = async (req, res) => {
  const { email, name, verified_email } = req.body.values;

  const user_sheet = {
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1],
    email,
    mobile_no: 11111111111,
    password: "chuck-artem",
    is_EV: true,
  };
  try {
    if (verified_email === false) {
      res.status(422).json({ error: "Your email is not verified" });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        if (user.mobile_no === "11111111111") {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          const result = { ...user._doc, token };
          res.status(200).json(result);
        } else {
          res.status(422).json({ error: "This Email is Already Exist" });
        }
      } else {
        const finalUser = new User(user_sheet);
        const token = jwt.sign({ _id: finalUser._id }, process.env.JWT_SECRET);
        const storeData = await finalUser.save();
        const userQueryData = new Userquery({
          user_id: storeData._id,
          activePrompt,
        });
        await userQueryData.save();

        const result = {
          _id: storeData._id,
          firstName: user_sheet.firstName,
          lastName: user_sheet.lastName,
          email,
          mobile_no: user_sheet.mobile_no,
          token,
        };

        res.status(200).json(result);
      }
    }
  } catch (error) {
    res.status(501).json(error);
    console.log("catch block error", error);
  }
};

module.exports = GoogleRegister;
