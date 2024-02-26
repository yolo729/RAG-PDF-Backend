
const Userquery = require("../../../models/UserQuery");

const { Document, VectorStoreIndex } = require("llamaindex");
const fs = require('fs');
const { indexStore } = require("./chat");
const { activePrompt } = require("../../../prompts");



const RetrainAllModels = async (req, res) => {
    if (!req.body.files && !req.body.files.length) { return res.status(400).send('Invalid Payload') }




    try {
        const userQuery = await Userquery.findOne({ user_id: req.token._id });


const indexPromises = req.body.files.map(async(file)=>{
    const { id, path } = file;
    const data = fs.readFileSync(path, 'utf8');
    // Create Document object with data
    const document = new Document({ text: data });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments([document]);
    return index;
})
const allPromise = await Promise.all(indexPromises);
console.log(allPromise)
        req.body.files.forEach(async (file,i) => {
         
            const { id, path } = file;

                const isPresent = indexStore.find((index) => index.user == req.token._id);
                if (!isPresent) {
                    indexStore.push({ user: req.token._id, indexes:{[activePrompt]:[{ fileId: id, index:allPromise[i] }]}});
                }
                else {
                    isPresent.indexes[activePrompt]=isPresent.indexes[activePrompt]||[];
                    isPresent.indexes[activePrompt].push({ fileId: id, index:allPromise[i] });
                }
           
           
       

            // return res.send(index);
            // generating and saving lamaindex vector and then changing the status of file
            let activePromptFiles = userQuery.files ? userQuery.files[activePrompt] : [];
            activePromptFiles = !activePromptFiles ? [] : activePromptFiles;
            const filePresent = activePromptFiles.find((file) => file.id == id);
            if (filePresent && activePromptFiles.length) {
                filePresent.retrained = true;
                // console.log(filePresent);
                if(i==req.body.files.length-1){

                    // console.log(userQuery.files[activePrompt],isPresent);

                const newUserQuery = new Userquery(userQuery);
                const result = await newUserQuery.save();
              console.log(indexStore);
            //   console.log(activePromptFiles);
                res.status(200).send({files:activePromptFiles});}
            }
            else {
                return res.status(400).send('No file found with provided id');
            }
        })
        // const newUserQuery = new Userquery(userQuery);
        // const result = await newUserQuery.save();
        // res.status(200).json(userQuery.files[activePrompt]);

    } catch (error) {
        res.status(501).json(error.message);
        console.log("catch block error", error.message);
    }
}

module.exports = RetrainAllModels;
