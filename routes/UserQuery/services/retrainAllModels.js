const {
  SimpleDirectoryReader,
  VectorStoreIndex,
  SentenceSplitter,
  SimpleVectorStore,
  Document,
} = require("llamaindex");

const Userquery = require("../../../models/UserQuery");
const fs = require("fs");
const indexStore = { index: null };

const RetrainAllModels = async (req, res) => {
  try {
    const path = "./uploads/filtered/";
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: path,
    });
    console.log("documents-------------", documents);

    // Split text into sentences
    // const sentenceSplitter = new SentenceSplitter();
    // const textChunks = documents.flatMap((doc) =>
    //   sentenceSplitter.splitText(doc.text)
    // );

    // // Create a vector store index
    // const vectorStore = new SimpleVectorStore();

    // // Convert text chunks to documents
    // const vectorStoreDocuments = textChunks.map((chunk) => ({
    //   pageContent: chunk,
    //   metadata: {},
    // }));

    // // Add documents to the vector store
    // vectorStoreDocuments.forEach(async (doc) => await vectorStore.add(doc));

    // // Save the index (optional)
    // await vectorStore.persist("./indexStore/index.json");

    // // const index = await VectorStoreIndex.fromVectorStore(vectorStore);
    // // indexStore.index = index;

    const index = await VectorStoreIndex.fromDocuments(documents);
    // indexStore.index = index;

    res.status(200).json({ result: "ok" });
  } catch (error) {
    res.status(501).json(error.message);
    console.log("catch block error--", error);
  }
};

module.exports = { RetrainAllModels, indexStore };
