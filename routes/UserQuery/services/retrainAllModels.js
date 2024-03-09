const {
  SimpleDirectoryReader,
  VectorStoreIndex,
  MarkdownNodeParser,
  LlamaParseReader,
} = require("llamaindex");

const Userquery = require("../../../models/UserQuery");
const fs = require("fs");
const indexStore = { index: null };

const RetrainAllModels = async (req, res) => {
  try {
    const path = "./uploads/";
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: path,
    });

    // const reader = new LlamaParseReader({
    //   apiKey: "llx-66p8Qdxur6U2Qljtp3XVoOb5SyeSzJtua8TmbI0U7pKhM15R",
    //   resultType: "markdown",
    // });
    // const documents = await reader.loadData({directory});

    // const parser = {
    //   api_key: "llx-66p8Qdxur6U2Qljtp3XVoOb5SyeSzJtua8TmbI0U7pKhM15R",
    //   result_type: "markdown",
    // };

    // file_extractor = { ".pdf": parser };
    // const documents = await new SimpleDirectoryReader().loadData({
    //   directoryPath: path,
    //   file_extractor,
    // });
    // const documents = await reader.load_data();

    const index = await VectorStoreIndex.fromDocuments(documents);
    indexStore.index = index;

    res.status(200).json({ result: "ok" });
  } catch (error) {
    res.status(501).json(error.message);
    console.log("catch block error--", error);
  }
};

module.exports = { RetrainAllModels, indexStore };
