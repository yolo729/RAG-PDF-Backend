const express = require("express");
const multer = require("multer");
const fs = require("fs");
const validateToken = require("../../../middleware/tokenauthenticate");
const Userquery = require("../../../models/UserQuery");
const UserSchema = require("../../../models/UserSchema");
const { activePrompt } = require("../../../prompts");
const { serverInfo, indexStore } = require("./chat");
const { initVectorIndex } = require("./utils");
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
    const files = req.files;
    try {
      const userQuery = await Userquery.findOne({ user_id: req.token._id });

      if (userQuery) {
        let activePromptFiles = userQuery?.files
          ? userQuery.files[activePrompt]
          : [];
        activePromptFiles = !activePromptFiles ? [] : activePromptFiles;
        const lastFileId = activePromptFiles.length
          ? activePromptFiles[activePromptFiles.length - 1].id + 1
          : 1;

        if (!userQuery.files) {
          const fileArray = [];
          files.map((file, i) => {
            fileArray.push({
              id: i + 1,
              title: file.filename,
              path: file.path,
            });
          });
          userQuery.files = {
            ...userQuery.files,
            [activePrompt]: fileArray,
          };
        } else {
          const result = files.map((file, i) => {
            userQuery.files[activePrompt].push({
              id: lastFileId + i,
              title: file.filename,
              path: file.path,
            });
          });
        }
      } else {
        const fileArray = [];
        files.map((file, i) => {
          fileArray.push({ id: i + 1, title: file.filename, path: file.path });
        });

        userQuery = {
          files: {
            [activePrompt]: fileArray,
          },
        };
      }

      const newUserQuery = new Userquery(userQuery);
      const result = await newUserQuery.save();
      serverInfo.restarted = false;
      await initVectorIndex(req.token._id);
      res.status(200).json(result.files);
    } catch (error) {
      res.status(401).json(error.message);
      console.log("err", error);
    }
  }
);

module.exports = UploadFile;
