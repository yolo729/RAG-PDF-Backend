const Userquery = require("../../../models/UserQuery");
const { activePrompt } = require("../../../prompts");
const { indexStore, serverInfo } = require("./chat");
const fs = require("fs");

const GetAllFiles = async (req, res) => {
  try {
    const userQuery = await Userquery.findOne({
      user_id: req.token._id,
    }).populate("user_id");

    if (!userQuery) {
      return res.status(400).send("no record found with provided id");
    }
    let activePromptFiles = userQuery.files
      ? userQuery.files[activePrompt]
      : [];
    activePromptFiles = !activePromptFiles ? [] : activePromptFiles;

    res.status(200).json({ files: activePromptFiles });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = GetAllFiles;
