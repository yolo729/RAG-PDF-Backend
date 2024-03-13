const fs = require("fs");
const path = require("path");
const textract = require("textract");

const getText = async (filepath) => {
  console.log("await filepath", filepath);
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filepath, (err, txt) => {
      if (err) {
        console.error(`Error extracting text from ${filepath}: ${err.message}`);
        resolve(""); // Resolve with an empty string or handle the error differently
      } else {
        resolve(txt);
      }
    });
  });
};

const GetAllFiles = async (req, res) => {
  try {
    const directoryPath = "./uploads/";
    const filteredPath = "./uploads/filtered";

    if (!fs.existsSync(filteredPath)) {
      fs.mkdirSync(filteredPath, { recursive: true });
    }

    const isFile = (fileName) => {
      return fs.lstatSync(fileName).isFile();
    };

    const filePaths = fs
      .readdirSync(directoryPath)
      .map((fileName) => path.join(directoryPath, fileName))
      .filter(isFile);

    const filePromises = filePaths.map(async (filePath) => {
      const texts = await getText(filePath);
      // const filteredText = await filterText(texts);
      const newFileName = path.join(
        filteredPath,
        path.basename(filePath, path.extname(filePath)) + ".txt"
      );
      await fs.writeFileSync(newFileName, texts);
      return newFileName;
    });

    const files = await Promise.all(filePromises);

    res.status(200).json({ files: files });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

// This is a placeholder function for filtering the text
// Replace it with your actual filtering logic
const filterText = async (text) => {
  // Example: Remove all vowels from the text
  return text.replace(/[^a-z]/gi, "\n");
};
module.exports = GetAllFiles;
