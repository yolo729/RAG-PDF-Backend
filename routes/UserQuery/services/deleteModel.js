const Userquery = require("../../../models/UserQuery");
const { activePrompt } = require("../../../prompts");
const { initVectorIndex } = require("./utils");
const fs = require("fs");
const DeleteModel = async (req, res) => {
  const { id, path } = req.body;
  console.log(id);
  if (!id && !path) {
    return res.status(400).send("Invalid payload");
  }
  try {
    let userQuery = await Userquery.findOne({
      user_id: req.token._id,
    }).populate("user_id");
    let activePromptFiles = userQuery.files
      ? userQuery.files[activePrompt]
      : [];
    activePromptFiles = !activePromptFiles ? [] : activePromptFiles;

    const isFilePresent = activePromptFiles.find((file) => file.id == id);
    if (!isFilePresent) {
      return res.status(400).send("no record found with provided id");
    }
    const filteredFiles = activePromptFiles.filter((file) => file.id != id);
    userQuery.files[[activePrompt]] = filteredFiles;
    fs.unlink(path, function (err) {
      if (err && err.code == "ENOENT") {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
      } else {
        console.info(`removed`);
      }
    });
    // let userIndex = await indexStore.find((item) => item.user == req.token._id);

    // console.log("index store called---------", indexStore);
    // console.log("userindex called---------", userIndex);
    // if (userIndex) {
    //   userIndex[activePrompt] = userIndex[activePrompt] || [];
    //   const filteredIndexs = userIndex.indexes[activePrompt].filter(
    //     (index) => index.fileId != id
    //   );
    //   userIndex = filteredIndexs;

    //   //   userIndex.indexes[activePrompt] = filteredIndexs;
    //   indexStore[0].indexes[activePrompt] = filteredIndexs;

    //   //   indexStore = { ...indexStore[0], system: filteredIndexs };
    //   console.log("delete model called---------", indexStore[0]);
    //   // return res.status(400).send('No retrained model found, please retrain first to continue with your queries')
    // }
    const newUserQuery = new Userquery(userQuery);
    const result = await newUserQuery.save();

    // console.log("Reinitializing vector db...");
    await initVectorIndex(req.token._id);
    // console.log("finish vector db !");
    res.status(200).send("Deleted successfully");
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = DeleteModel;
