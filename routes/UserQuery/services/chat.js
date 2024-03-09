const Userquery = require("../../../models/UserQuery");
const Prompt = require("../../../models/Prompt");
const GPT = require("../../../models/UserGPT");
const OpenAIApi = require("openai");
const { activePrompt, allPrompts } = require("../../../prompts");
const { indexStore } = require("./retrainAllModels");
const e = require("cors");

let serverInfo = { restarted: true };
let solution = null;
// const newConfig = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
//   });
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});
const Chat = async (req, res) => {
  const { id = 0, question, title, isNew, modelId } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (isNew && !title) {
    return res.status(400).json({ error: "Please provide chat title" });
  }

  // indexStore = await initVectorIndex(user._id);

  try {
    if (indexStore.index === null) {
      solution = await directGptQuery(question, req.token._id);
    } else {
      const queryEngine = indexStore.index.asQueryEngine();
      const response = await queryEngine.query({ query: question });
      solution = response.toString();
      if (solution === "Empty Response") {
        solution = await directGptQuery(question, req.token._id);
      }
    }

    const userQuery = await Userquery.findOne({ user_id: req.token._id });

    let activePromptChats = userQuery.chats
      ? userQuery.chats[activePrompt]
      : [];
    activePromptChats = !activePromptChats ? [] : activePromptChats;
    if (isNew) {
      const newChatId = activePromptChats.length
        ? activePromptChats[activePromptChats.length - 1].id + 1
        : 1;
      const newChat = {
        id: newChatId,
        title,
        queries: [{ question_id: 1, question, solution }],
      };
      activePromptChats.push(newChat);
      userQuery.chats = {
        ...userQuery.chats,
        [activePrompt]: activePromptChats,
      };
    } else {
      const myChat = activePromptChats.find((chat) => chat.id == id);
      if (myChat) {
        const quesriesLength = myChat.queries.length;
        const newQuestionId = quesriesLength
          ? myChat.queries[quesriesLength - 1].question_id + 1
          : 1;
        myChat.queries = [
          ...myChat.queries,
          { question_id: newQuestionId, question, solution },
        ];
      } else {
        return res.status(400).send("No record found with this chat id");
      }
    }
    const newUserQuery = new Userquery(userQuery);
    const result = await newUserQuery.save();
    solution = null;
    res.status(200).send({ chats: result.chats[activePrompt] });
  } catch (error) {
    solution = null;
    res.status(501).send(error.message);
    console.log("catch block error", error.message);
  }
};

const prompt = allPrompts.find((prompt) => prompt.title == "system");

const directGptQuery = async (question, user_id) => {
  const userPrompt = await Prompt.findOne({ user_id });
  const userGPT = await GPT.findOne({ user_id });
  let system_content, user_content;
  if (userPrompt) {
    system_content =
      userPrompt.detail && userPrompt.detail !== ""
        ? userPrompt.detail
        : prompt.description;
    user_content =
      userPrompt.detail && userPrompt.detail !== ""
        ? question + userPrompt.detail
        : question;
  } else {
    system_content = prompt.description;
    user_content = question;
  }
  let gpt_model;
  if (userGPT) {
    gpt_model = userGPT.gpt === "" ? "gpt-4-0125-preview" : userGPT.gpt;
  } else {
    gpt_model = "gpt-4-0125-preview";
  }
  const GPTOutput = await openai.chat.completions.create({
    model: gpt_model,
    messages: [
      { role: "system", content: system_content },
      { role: "user", content: user_content },
    ],
  });
  return GPTOutput.choices[0].message.content;
};

module.exports = { Chat, indexStore, serverInfo };
