const {
  SimpleDirectoryReader,
  VectorStoreIndex,
  SentenceSplitter,
  SimpleVectorStore,
  Document,
} = require("llamaindex");

const Userquery = require("../../../models/UserQuery");
const fs = require("fs");
const indexStore = { index: null };

const RetrainAllModels = async (req, res) => {
  try {
    const path = "./uploads/filtered/";
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: path,
    });

    const index = await VectorStoreIndex.fromDocuments(documents);
    indexStore.index = index;

    res.status(200).json({ result: "ok" });
  } catch (error) {
    res.status(501).json(error.message);
    console.log("catch block error--", error);
  }
};

module.exports = { RetrainAllModels, indexStore };
