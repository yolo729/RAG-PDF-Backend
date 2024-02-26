const express = require("express");
const SetGPT = require("./services/setGPT");
const GetGPT = require("./services/getGPT");

const router = express.Router();

router.post("/setGPT", SetGPT);
router.get("/get", GetGPT);

module.exports = router;
