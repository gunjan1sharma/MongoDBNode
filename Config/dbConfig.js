const { MongoClient } = require("mongodb");
require("dotenv").config();
const url = `mongodb+srv://mongodbgunjan:${process.env.CLUSTER_PASSWORD}@cluster0.na24thz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(url);
const dbName = "notesdb";
let db;

async function main() {
  //Connecting with mongoDB Atlas
  await client.connect();
  db = client.db(dbName);
}

main()
  .then((value) => {
    db = client.db(dbName);
    console.log("Server Established Successfully With MongoDB..");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = { client, db };
