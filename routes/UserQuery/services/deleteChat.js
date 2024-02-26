const Userquery = require("../../../models/UserQuery");
const { activePrompt } = require("../../../prompts");



const DeleteChat = async (req, res) => {
   
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('Invalid payload');
    }
    try {
        const userQuery = await Userquery.findOne({ user_id: req.token._id }).populate("user_id");

        let activePromptChats = userQuery.chats ? userQuery.chats[activePrompt] : [];
        activePromptChats=!activePromptChats?[]:activePromptChats;
        
        const isChatPresent = activePromptChats.find((chat) => chat.id == id);
        if (!isChatPresent) {
            return res.status(400).send('no record found with provided id');
        }
        const filteredChats = activePromptChats.filter((chat) => chat.id != id);
        userQuery.chats[activePrompt] = filteredChats;

        const newUserQuery = new Userquery(userQuery);
        const result = await newUserQuery.save();
        res.status(200).send({msg:'Chat Deleted successfully',chats:filteredChats});
    }
    catch (error) {
        res.status(401).json(error.message)
    }


}

module.exports = DeleteChat