const Userquery = require("../../../models/UserQuery")



const llmTemp=async(req,res)=>{
    const llmTemp=req.body.llmTemp;
    if (!llmTemp) {
       return res.status(400).send("pls field the input..")
    }

    try {
        const userQuery = await Userquery.findOne({user_id: req.token._id });
        userQuery.llmTemp=llmTemp;
        
        const newUser = new Userquery(userQuery);
        const setLlmTemp = await newUser.save();
        res.status(200).send(setLlmTemp);
    } 
    catch (error) {
        res.status(400).send(error)
    }
}

module.exports=llmTemp;