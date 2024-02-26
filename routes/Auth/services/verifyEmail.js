const User = require("../../../models/UserSchema");
const Userquery = require("../../../models/UserQuery");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const { activePrompt } = require("../../../prompts");

const VerifyEmail = async (req, res) => {
  try {
    const { e_string, p_string } = req.body;
    const e_token = e_string
      .toString()
      .replaceAll("xMl3Jk", "+")
      .replaceAll("Por21Ld", "/")
      .replaceAll("Ml32", "=");

    const p_token = p_string
      .toString()
      .replaceAll("xMl3Jk", "+")
      .replaceAll("Por21Ld", "/")
      .replaceAll("Ml32", "=");
    const ebytes = CryptoJS.AES.decrypt(e_token, process.env.CRYPTO_KEY);
    const emailT = ebytes.toString(CryptoJS.enc.Utf8);

    const pbytes = CryptoJS.AES.decrypt(p_token, process.env.CRYPTO_KEY);
    const tokenP = pbytes.toString(CryptoJS.enc.Utf8);

    const user = await User.findOne({ email: emailT, is_EV: false });
    if (!user) {
      res.status(422).json({ error: "Invalid Request" });
    } else {
      user.is_EV = true;
      user.password = tokenP;
      const finalUser = new User(user);
      const token = jwt.sign({ _id: finalUser._id }, process.env.JWT_SECRET);
      const storeData = await finalUser.save();
      const userQueryData = new Userquery({
        user_id: storeData._id,
        activePrompt,
      });
      await userQueryData.save();
      const result = { ...user._doc, _id: storeData._id, token };

      res.status(200).json(result);
      // res.status(200).json(user);
    }
  } catch (error) {
    res.status(501).json(error);
    console.log("catch block error", error);
  }
};

module.exports = VerifyEmail;
