'use strict';

const dbconnection = function (mongoose) {

  //Promisify mongoose with Bluebird
  mongoose.Promise = require('bluebird');
  // const MONGO_URI = `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}/${config.dbname}?ssl=true&replicaSet=krds-sg-shard-0&authSource=admin`;
  const MONGO_URI =  'mongodb://localhost:27017/test';
  const mongoOptions = {
    keepAlive: 2000,
    connectTimeoutMS: 30000,
    reconnectTries: Number.MAX_VALUE
  };

  mongoose.connect(MONGO_URI, mongoOptions);

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
  });

  mongoose.connection.on('reconnected', function () {
    console.log('MongoDB event reconnected');
  });

  mongoose.connection.on('connected', function () {
    console.log('info', "[STARTUP] Connecting to DB...", { tags: 'startup,mongo' });
  });

  // When the connection is disconnected, Log the error
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });

  const cleanup = () => {
    mongoose.connection.close(() => {
      console.log('Mongoose disconnected');
      process.exit(0);
    });
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  return mongoose.connection;

}

module.exports = {
  dbconnection
};