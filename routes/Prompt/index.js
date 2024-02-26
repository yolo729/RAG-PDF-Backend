const express = require("express");
const AddNewPrompt = require("./services/addNewPrompt");
const GetUserPrompt = require("./services/getUserPrompt");

const router = express.Router();

router.post("/set", AddNewPrompt);
router.get("/get", GetUserPrompt);

module.exports = router;
