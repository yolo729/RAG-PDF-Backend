const mongoose = require("mongoose");

const userQueries = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  activePrompt: {
    type: String,
  },
  chats: { type: Object },
  files: { type: Object },
});

const Userquery = new mongoose.model("user_queries", userQueries);
module.exports = Userquery;
