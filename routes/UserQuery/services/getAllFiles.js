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

    if (activePromptFiles.length && !!serverInfo.restarted) {
      fs.rmSync("./uploads/" + req.token._id, { recursive: true, force: true });
      userQuery.files[activePrompt] = [];
      userQuery.activeModel = "gpt-4-0125-preview";
      const newQuery = new Userquery(userQuery);
      await newQuery.save();
      return res.status(200).json({ models: [], files: [] });
    }

    const isPresent = indexStore.find((index) => index.user == req.token._id);
    console.log("ispresent---------", isPresent);
    indexes = [];
    if (isPresent) {
      isPresent.indexes[activePrompt] = isPresent.indexes[activePrompt] || [];
      indexes = isPresent.indexes[activePrompt];
    } else {
      console.log("else conditions");
    }

    const models = indexes.map((index) => index.modelId);
    res.status(200).json({ models, files: activePromptFiles });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = GetAllFiles;
