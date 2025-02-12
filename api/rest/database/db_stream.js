const {
  DatabaseError,
  NotFoundError,
  IncorrectIdFormatError,
} = require("./databaseError.js");
const { ObjectId } = require("mongodb");
const mongoClient = require("./mongoClient.js");

const database = mongoClient.getDB();
const stream = database.collection("stream");

const addStream = async (data) => {
  try {
    const result =  await stream.insertOne(data);
    return result.insertedId.toString()
  } catch (e) {
    if (e?.statusCode) {
      throw e;
    }
    throw new DatabaseError();
  }
};

const getStreams = async (data) => {
  try {
    const streams = await stream.find().toArray();
    return streams;
  } catch (e) {
    if (e?.statusCode) {
      throw e;
    }
    throw new DatabaseError();
  }
};

const stopStream = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new IncorrectIdFormatError();
    }

    const streams = await stream.find().toArray();

    const result = await stream.updateOne(
      { _id: new ObjectId(id) },
      { $set: { live: false } }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundError();
    }
  } catch (e) {
    if (e?.statusCode) {
      throw e;
    }
    throw new DatabaseError();
  }
};

module.exports = {
  addStream,
  getStreams,
  stopStream
};
