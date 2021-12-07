const express = require("express");
const router = express.Router();

const auth = require("../Middleware/auth.middleware");
const projectMiddleware = require("../Middleware/project.middleware");
const validate = require("../Middleware/validators.middleware");
const { create, getMessageByConversation } = require("../Controllers/message.controller");
const messageMiddleware = require("../Middleware/message.middleware");
router.post("/send_msg", messageMiddleware.preCheckAiMessage, validate.message.create, create);
router.get("/get_message_by_conversation", auth,getMessageByConversation);

module.exports = router;