const Userquery = require("../../../models/UserQuery");

const {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
} = require("llamaindex");
// const fs = require("fs");
const { indexStore } = require("./chat");
const { initVectorIndex } = require("./utils");
const { activePrompt } = require("../../../prompts");

const RetrainModel = async (req, res) => {
  try {
    // const data = req.body.files.map((file) => {
    //   const { id, path } = file;
    //   return new Document({text:fs.readFileSync(path, 'utf8')})
    // })
    const userQuery = await Userquery.findOne({ user_id: req.token._id });
    // Create Document object with data
    // console.log(data)

    // Split text and create embeddings. Store them in a VectorStoreIndex
    // SimpleDirectoryReader().load_data()

    const index = await initVectorIndex(req.token._id);
    indexStore = index;
    // const readDir = new SimpleDirectoryReader();
    // const data = await readDir.loadData({
    //   directoryPath: "./uploads/" + req.token._id,
    // });
    // const index = await VectorStoreIndex.fromDocuments(data);

    // indexStore = {
    //   user: req.token._id,
    //   indexes: { [activePrompt]: [{ index }] },
    // };

    // let activeModel = "";
    // const isPresent = indexStore.user && indexStore.user === req.token._id ? indexStore:[]
    // const isPresent = indexStore.find((index) => index.user == req.token._id);

    // if (!isPresent) {
    //   console.log("indexStore-0------", indexStore);
    //   indexStore = {
    //     user: req.token._id,
    //     indexes: { [activePrompt]: [{ modelId: 1, index }] },
    //   };
    //   console.log("indexStore-1------", indexStore);
    //   activeModel = 1;
    // } else {
    //   activeModel = 1;
    //   // isPresent.indexes[activePrompt] = isPresent.indexes[activePrompt] || [];
    //   // const indexes = isPresent.indexes[activePrompt];
    //   // const modelId = indexes.length
    //   //   ? indexes[indexes.length - 1].modelId + 1
    //   //   : 1;
    //   // activeModel = modelId;
    //   // isPresent.indexes[activePrompt].push({ modelId, index });
    // }

    // return res.send(index);
    // generating and saving lamaindex vector and then changing the status of file

    req.body.files.forEach((file) => {
      const { id } = file;
      let activePromptFiles = userQuery.files
        ? userQuery.files[activePrompt]
        : [];
      activePromptFiles = !activePromptFiles ? [] : activePromptFiles;
      const filePresent = activePromptFiles.find((file) => file.id == id);
      if (filePresent && activePromptFiles.length) {
        filePresent.retrained = true;
      } else {
        return res.status(400).send("No file found with provided id");
      }
    });

    // const indexStoreUpdated = indexStore.find(
    //   (index) => index.user == req.token._id
    // );
    // const models = indexStoreUpdated.indexes[activePrompt].map(
    //   (index) => index.modelId
    // );
    const newUserQuery = new Userquery(userQuery);
    const result = await newUserQuery.save();
    res.status(200).json({ result });
    // res
    //   .status(200)
    //   .json({ models, files: userQuery.files[activePrompt], activeModel });
  } catch (error) {
    res.status(501).json(error.message);
    console.log("catch block error", error.message);
  }
};

module.exports = RetrainModel;
