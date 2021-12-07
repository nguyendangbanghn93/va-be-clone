// Configuring the database
const dbConfig = require("../../config/database.config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // replicaSet      : 'rs0', //
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connect to the database.", err);
        process.exit();
    });
const conn = mongoose.connection;

module.exports = conn;