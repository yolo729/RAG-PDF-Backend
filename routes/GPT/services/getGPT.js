const GPT = require("../../../models/UserGPT");

const GetGPT = async (req, res) => {
  try {
    const user_gpt = await GPT.findOne({ user_id: req.token._id });
    res.status(200).send(user_gpt);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("getting user gpt ------------", error);
  }
};

module.exports = GetGPT;
