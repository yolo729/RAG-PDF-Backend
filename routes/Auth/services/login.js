const User = require("../../../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Userquery = require("../../../models/UserQuery");
const { initVectorIndex } = require("../../UserQuery/services/utils");
const Prompt = require("../../../models/Prompt");

const { allPrompts, activePrompt } = require("../../../prompts");

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ error: "You are not registered...", type: 1 });
    } else {
      if (user.is_EV === false) {
        res.status(401).json({ error: "Please verify your email", type: 2 });
      } else {
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          const { _id, firstName, lastName, email, mobile_no } = user;
          const result = { _id, firstName, lastName, email, mobile_no, token };

          const userQuery = await Userquery.findOne({ user_id: user._id });
          if (userQuery === null) {
            const userQueryData = new Userquery({
              user_id: user._id,
            });
            await userQueryData.save();
          }

          // const newPrompt = allPrompts.find(
          //   (prompt) => prompt.title == activePrompt
          // );
          // const promptData = new Prompt({
          //   ...newPrompt,
          // });

          // await promptData.save();

          // await initVectorIndex(user._id);
          res.msg = "Login Successfully";
          res.status(200).json(result);
        } else {
          res.status(401).json({ error: "Invalid email or password", type: 0 });
        }
      }
    }
  } catch (error) {
    res.status(501).json(error.message);
    console.log("login catch error", error);
  }
};

module.exports = Login;
