require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const url = process.env.DB_URL;
var db;

console.log(url)

module.exports = {
  connectToServer: async () => {
    client = await MongoClient.connect(url);
    db = client.db("Stream");
  },

  getDB: () => {
    return db;
  },
};
