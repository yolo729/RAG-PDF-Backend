const Prompt = require("../../../models/Prompt");

const AddNewPrompt = async (req, res) => {
  // if (!req.body.title) {
  //   return res.status(400).send("Invalid payload");
  // }
  try {
    const system_prompt = await Prompt.findOne({ user_id: req.token._id });
    if (system_prompt) {
      system_prompt._doc = { ...system_prompt._doc, detail: req.body.prompt };
    }
    const new_prompt = system_prompt
      ? system_prompt
      : {
          user_id: req.token._id,
          title: req.body.title ? req.body.title : "system",
          detail: req.body.prompt,
        };

    const promptData = new Prompt(new_prompt);
    const saved = await promptData.save();
    res.status(200).send(saved);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("catch block error", error);
  }
};

module.exports = AddNewPrompt;
