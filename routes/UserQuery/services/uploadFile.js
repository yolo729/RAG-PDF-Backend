const express = require("express");
const multer = require("multer");
const fs = require("fs");
const validateToken = require("../../../middleware/tokenauthenticate");
const Userquery = require("../../../models/UserQuery");
const UserSchema = require("../../../models/UserSchema");
const { activePrompt } = require("../../../prompts");
const { serverInfo } = require("./chat");
const router = express.Router();
const { BlockBlobClient } = require("@azure/storage-blob");

const ENV = process.env.ENV;

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      const path = "uploads/" + req.token._id;
      fs.mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + "-" + file.originalname);
    },
  }),
}).single("file");

const getBlobName = async (originalName, token_id) => {
  const user = await UserSchema.findOne({ _id: token_id });
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return user
    ? `${user.email}-${originalName}`
    : `${identifier}-${originalName}`;
};

const UploadFile = router.post(
  "/uploadFile",
  validateToken,
  upload,
  async (req, res) => {
    const { filename, path } = req.file;
    try {
      if (ENV === "prod") {
        const blobName = await getBlobName(filename, req.token._id);
        const blobService = new BlockBlobClient(
          process.env.AZURE_STORAGE_CONNECTION_STRING,
          process.env.AZURE_CONTAINER_NAME,
          blobName
        );

        blobService
          .uploadFile(path)
          .then(() => {
            // fs.unlinkSync(path);
            console.log("------file upload success");
          })
          .catch((err) => {
            if (err) {
              console.log("------file upload error", err);
              return;
            }
          });
      }
      let userQuery = await Userquery.findOne({ user_id: req.token._id });

      console.log("userquery------------", userQuery);

      if (userQuery) {
        let activePromptFiles = userQuery?.files
          ? userQuery.files[activePrompt]
          : [];
        activePromptFiles = !activePromptFiles ? [] : activePromptFiles;
        const lastFileId = activePromptFiles.length
          ? activePromptFiles[activePromptFiles.length - 1].id + 1
          : 1;
        const prevFiles = userQuery?.files || [];
        userQuery.files = {
          ...prevFiles,
          [activePrompt]: [
            ...activePromptFiles,
            { id: lastFileId, title: filename, path },
          ],
        };
      } else {
        userQuery = {
          files: {
            [activePrompt]: [{ id: 1, title: filename, path }],
          },
        };
      }
      const newUserQuery = new Userquery(userQuery);
      const result = await newUserQuery.save();
      serverInfo.restarted = false;
      res.status(200).json(result.files);
    } catch (error) {
      res.status(401).json(error.message);
      console.log("err", error);
    }
  }
);

module.exports = UploadFile;
