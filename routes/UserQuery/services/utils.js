const { VectorStoreIndex, SimpleDirectoryReader } = require("llamaindex");
const fs = require("fs");

const initVectorIndex = async (userid) => {
  const path = "./uploads/" + userid;
  if (fs.existsSync(path)) {
    const readDir = new SimpleDirectoryReader();
    const data = await readDir.loadData({
      directoryPath: "./uploads/" + userid,
    });
    const index = await VectorStoreIndex.fromDocuments(data);

    return index;
  } else {
    return null;
  }
};

module.exports = { initVectorIndex };
