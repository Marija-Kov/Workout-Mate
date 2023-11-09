const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let connection;
let mongoServer;

module.exports.connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  connection = await mongoose.connect(mongoServer.getUri(), {
    dbName: "test_mern_app",
  });
};

module.exports.close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  connection = null;
  mongoServer = null;
};

module.exports.clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
