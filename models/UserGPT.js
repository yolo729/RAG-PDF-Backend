const mongoose = require("mongoose");

const gptSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  gpt: {
    type: String,
  },
});

const UserGPT = new mongoose.model("user_gpt", gptSchema);
module.exports = UserGPT;
