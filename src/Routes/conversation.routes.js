const express = require("express");
const { getConversationByChannel, detail } = require("../Controllers/conversation.controllers");
const router = express.Router();
const auth = require("../Middleware/auth.middleware");

router.get("/get_conversation_by_channel", auth, getConversationByChannel);
router.get("/detail/:id", auth, detail);

module.exports = router;