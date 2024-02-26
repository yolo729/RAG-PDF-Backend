const Userquery = require("../../../models/UserQuery");


const GetActiveModel = async (req, res) => {

    try {
        const userQuery = await Userquery.findOne({ user_id: req.token._id });
        res.status(200).send({activeModel:userQuery.activeModel||'chatgpt'});
    }
    catch (error) {
        res.status(401).json(error)
    }


}

module.exports = GetActiveModel