const { VectorStoreIndex, SimpleDirectoryReader } = require("llamaindex");
const fs = require("fs");

const indexStore = Object.create(VectorStoreIndex.prototype);

const deepClone = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const cloned = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
};

const initVectorIndex = async (userid) => {
  const path = "./uploads/" + userid;
  if (fs.existsSync(path)) {
    const readDir = new SimpleDirectoryReader();
    const data = await readDir.loadData({
      directoryPath: "./uploads/" + userid,
    });
    const index = await VectorStoreIndex.fromDocuments(data);

    Object.assign(indexStore, index);
    return index;
  } else {
    return null;
  }
};

module.exports = { initVectorIndex, indexStore };
