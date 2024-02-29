const express = require("express");
const multer = require("multer");
const fs = require("fs");
const validateToken = require("../../../middleware/tokenauthenticate");
const Userquery = require("../../../models/UserQuery");
const UserSchema = require("../../../models/UserSchema");
const { activePrompt } = require("../../../prompts");
const { serverInfo } = require("./chat");
const router = express.Router();

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
}).array("files");

const UploadFile = router.post(
  "/uploadFile",
  validateToken,
  upload,
  async (req, res) => {
    console.log("reqfiles=----------------", req.files);
    const files = req.files;
    try {
      let userQuery = await Userquery.findOne({ user_id: req.token._id });
      if (userQuery) {
        let activePromptFiles = userQuery?.files
          ? userQuery.files[activePrompt]
          : [];
        activePromptFiles = !activePromptFiles ? [] : activePromptFiles;
        const lastFileId = activePromptFiles.length
          ? activePromptFiles[activePromptFiles.length - 1].id + 1
          : 1;
        // const prevFiles = userQuery?.files || [];
        const result = files.map((file, i) => {
          userQuery.files[activePrompt].push({
            id: lastFileId + i,
            title: file.filename,
            path: file.path,
          });
        });
      } else {
        const result = files.map((file, i) => {
          userQuery.files[activePrompt].push({
            id: i,
            title: file.filename,
            path: file.path,
          });
        });
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
