const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv").config();
const connectDb = require("./db/connection");
const AuthRoutes = require("./routes/Auth");
const UserQueryRoutes = require("./routes/UserQuery");
const ProfileRoutes = require("./routes/Profile");
const PromptRoutes = require("./routes/Prompt");
const GPTRoutes = require("./routes/GPT");
const validateToken = require("./middleware/tokenauthenticate");

app.use(cors());
app.use(express.json());
connectDb();
const PORT = process.env.PORT;
const ENV = process.env.ENV;
app.use("/api/auth", AuthRoutes);
app.use("/api/user_query", validateToken, UserQueryRoutes);
app.use("/api/profile", validateToken, ProfileRoutes);
app.use("/api/prompt", validateToken, PromptRoutes);
app.use("/api/user_gpt", validateToken, GPTRoutes);

app.get("/", (req, res) => {
  res.send("Running Server");
});
const server = app.listen(
  PORT,
  ENV == "prod" ? "0.0.0.0" : "127.0.0.1",
  function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(server.address());
    console.log("running at http://" + host + ":" + port);
  }
);
