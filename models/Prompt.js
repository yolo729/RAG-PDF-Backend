const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
  },
  detail: { type: String },
});

const Prompt = new mongoose.model("prompts", promptSchema);
module.exports = Prompt;
