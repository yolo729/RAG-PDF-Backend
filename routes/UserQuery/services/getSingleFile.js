const Userquery = require("../../../models/UserQuery");
const { activePrompt } = require("../../../prompts");

const GetSingleFile = async (req, res) => {
    const {id} = req.body; 
    if(!id){
      return  res.status(400).send('Invalid payload');
    }
    try {
        const userQuery = await Userquery.findOne({ user_id: req.token._id }).populate("user_id");
       
        let activePromptFiles = userQuery.files ? userQuery.files[activePrompt] : [];
        activePromptFiles=!activePromptFiles?[]:activePromptFiles;
        const isFilePresent = activePromptFiles.find((file)=>file.id==id);
        if(!isFilePresent){
            return  res.status(400).send('no record found with provided id');
        }
        res.status(200).send(isFilePresent)
    }
    catch (error) {
        res.status(401).json(error.message)
    }


}

module.exports = GetSingleFile