const Userquery = require("../../../models/UserQuery");
const { activePrompt } = require("../../../prompts");
const { indexStore } = require("./chat");



const SetActiveModel = async (req, res) => {
    console.log(req.body)
    if (!req.body.id) {
        return res.status(400).send("invalid payload")
    }
    const { id } = req.body;
    try {
        const userQuery = await Userquery.findOne({ user_id: req.token._id });
        const userIndex = indexStore.find((item) => item.user == req.token._id);
        if (!userIndex) {
            return res.status(400).send('No retrained model found with provided id');
        }
        const indexes = userIndex.indexes[activePrompt] || [];

        const modelPresent = indexes.find((model) => model.modelId == id);
        if (!modelPresent) {
            return res.status(400).send('No retrained model found with provided id');
        }

        userQuery.activeModel = id;

        const newUserQuery = new Userquery(userQuery);
        const result = await newUserQuery.save();
        res.status(200).send({ activeModel: result.activeModel });
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = SetActiveModel;