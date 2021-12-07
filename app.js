const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Server } = require("socket.io");
const { errorHandler } = require('./src/Utils/ResponseHandler')
const { registerWebhook, recieveDataWebhookSocket } = require('./src/Controllers/webhook.controllers');
require("dotenv").config();


// create express app
const app = express();
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'somesecret',
  cookie: { maxAge: 60000 }
}));
//cors
const cors = require('cors')
app.use(cors())
// Setup server port
const port = process.env.PORT || 8001;

// Setup passport
app.use(passport.initialize());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
require("./src/db/index")
require("./src/Utils/passport")

// define a root/default route
app.get('/', (req, res) => {
  res.json({ "message": "Test" });
});

// Require Users routes
const routes = require("./src/Routes");
const { runSocket } = require('./src/Utils/socket');
// const userRoutes = require("./src/Routes/users.routes");
// using as middleware
app.use("/v1/api", routes);
app.use((err, req, res, next) => {
  errorHandler(err, res);
});
const server = require('http').createServer(app)
const io = new Server(server);
require('./src/Utils/socket')(io)

const recieveDataWebhook = async (req, res) => {
  await recieveDataWebhookSocket(req, res, io)
}

//facebook webhook
app.get('/fb-gateway/facebook-webhook', registerWebhook)
app.post('/fb-gateway/facebook-webhook', recieveDataWebhook)

// listen for requests400
server.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});
