const express = require("express");
const Register = require("./services/register");
const VerifyEmail = require("./services/verifyEmail");
const GoogleRegister = require("./services/googleRegister");
const Login = require("./services/login");
const validateToken = require("../../middleware/tokenauthenticate");
const UpdatePassword = require("./services/updatePassword");
const forgetPassword = require("./services/forgotPassword");
const router = express.Router();

router.post("/googleRegister", GoogleRegister);
router.post("/register", Register);
router.post("/verifyEmail", VerifyEmail);
router.post("/login", Login);
router.put("/updatepassword", validateToken, UpdatePassword);
router.post("/forgotpassword", forgetPassword);

module.exports = router;
