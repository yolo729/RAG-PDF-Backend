const express = require("express");
const GetProfile = require("./services/getProfile");
const EditProfile = require("./services/editProfile");
const forgetPassword = require("../Auth/services/forgotPassword");


const router = express.Router();


router.get("/", GetProfile);
router.put("/edit", EditProfile);
router.get("/forgotPassword",forgetPassword)



module.exports = router;