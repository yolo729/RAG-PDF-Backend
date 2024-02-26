const Prompt = require("../../../models/Prompt");

const GetUserPrompt = async (req, res) => {
  try {
    const system_prompt = await Prompt.findOne({ user_id: req.token._id });
    res.status(200).send(system_prompt);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("getting user prompt ------------", error);
  }
};

module.exports = GetUserPrompt;
