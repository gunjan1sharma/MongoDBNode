const express = require("express");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const dbConfig = require("./Config/dbConfig.js");
const noteRoutes = require("./Routes/noteRoute.js");

const PORT = process.env.PORT || 3003;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/notes", noteRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({
    statusCode: 200,
    status: "success",
    clientId: uuidv4(),
    message: "MongoDBNodeCrud App is running successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server Started Running On Port ${PORT}`);
});
