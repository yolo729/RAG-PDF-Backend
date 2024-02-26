const GPT = require("../../../models/UserGPT");

const setGPT = async (req, res) => {
  try {
    const gpt = await GPT.findOne({ user_id: req.token._id });
    if (gpt) {
      gpt._doc = { ...gpt._doc, gpt: req.body.gpt };
    }
    const new_gpt = gpt
      ? gpt
      : {
          user_id: req.token._id,
          gpt: req.body.gpt,
        };

    const gptData = new GPT(new_gpt);
    const saved = await gptData.save();
    res.status(200).send(saved);
  } catch (error) {
    res.status(501).send(error.message);
    console.log("error occured in addGPT-----", error);
  }
};

module.exports = setGPT;
