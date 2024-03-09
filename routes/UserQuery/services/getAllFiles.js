const fs = require("fs");
const path = require("path");
const GetAllFiles = async (req, res) => {
  try {
    const directoryPath = "./uploads/";
    const isFile = (fileName) => {
      return fs.lstatSync(fileName).isFile();
    };
    const files = fs
      .readdirSync(directoryPath)
      .map((fileName) => {
        return path.join(directoryPath, fileName);
      })
      .filter(isFile);
    res.status(200).json({ files });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = GetAllFiles;
