const Userquery = require("../../../models/UserQuery");
const { activePrompt } = require("../../../prompts");

const GetQuery = async (req, res) => {
  try {
    const userQuery = await Userquery.findOne({
      user_id: req.token._id,
    }).populate("user_id");
    let activePromptChats = userQuery?.chats
      ? userQuery.chats[activePrompt]
      : [];
    activePromptChats = !activePromptChats ? [] : activePromptChats;
    res.status(200).send({ chats: activePromptChats });
  } catch (error) {
    console.log("Getting User Query error occured--------", error);
    res.status(401).json(error);
  }
};

module.exports = GetQuery;
