const  OpenAIApi  = require("openai");
const env = require('dotenv').config();
const openai = new OpenAIApi({ 
    apiKey: process.env.OPENAI_API_KEY 
  });



  const directGptQuery=async(question)=>{
    const GPTOutput = await openai.chat.completions.create({ 
        model: "gpt-4-0613", 
        messages: [{ role: "user", content: question }], 
      }); 
    console.log(GPTOutput.choices[0].message.content)
     return GPTOutput.choices[0].message.content; 
     
};


directGptQuery("who is virat kohli");