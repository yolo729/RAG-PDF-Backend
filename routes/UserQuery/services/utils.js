const {
  VectorStoreIndex,
  SimpleDirectoryReader,
  SimpleNodeParser,
} = require("llamaindex");
const fs = require("fs");

const indexStore = Object.create(VectorStoreIndex.prototype);

const isExistFiles = { value: false };

const initVectorIndex = async (userid) => {
  const path = "./uploads/" + userid;
  if (fs.existsSync(path)) {
    const readDir = new SimpleDirectoryReader();
    const data = await readDir.loadData({
      directoryPath: "./uploads/" + userid,
    });

    // const nodeParser = new SimpleNodeParser();
    // const nodes = nodeParser.getNodesFromDocuments([data]);
    if (data.length > 0) {
      Object.assign(isExistFiles, { value: true });
      console.log("isExistFiles---0----", isExistFiles.value);
      const index = await VectorStoreIndex.fromDocuments(data);
      // index.indexStore.persist("./indexStore/tim_index.json");
      Object.assign(indexStore, index);
      return index;
    } else {
      Object.assign(isExistFiles, { value: false });
      console.log("isExistFiles---1----", isExistFiles.value);
      return null;
    }
  } else {
    Object.assign(isExistFiles, { value: false });
    console.log("isExistFiles---w----", isExistFiles.value);
    return null;
  }
};

module.exports = { initVectorIndex, indexStore, isExistFiles };
