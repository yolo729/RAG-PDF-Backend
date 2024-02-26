const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  mobile_no: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  is_EV: {
    type: Boolean,
    default: false,
  },
});

// hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = new mongoose.model("user", userSchema);
module.exports = User;
