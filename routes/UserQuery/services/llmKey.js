const Userquery = require("../../../models/UserQuery")


const llmKey=async(req,res)=>{
    const llmKey=req.body.llmKey;
    if (!llmKey) {
       return res.status(400).send("pls field the input..")
    }

    try {
        const userQuery = await Userquery.findOne({user_id: req.token._id });
        userQuery.llmKey=llmKey;
        const newUser = new Userquery(userQuery);
        const setLlmKey = await newUser.save();
        res.status(200).send(setLlmKey);
    } 
    catch (error) {
        res.status(400).send(error)
    }
}
module.exports=llmKey;  