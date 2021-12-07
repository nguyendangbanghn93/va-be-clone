const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema(
    {
        channel: {
            type: String,
            ref: "channel",
        },
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "message"
        }],
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project"
        },
        customer: {
            type: String,
            ref: "customer"
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }]
    },
    { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;