const mongoose = require("mongoose");
const { Status } = require("../Enums");
const messageSchema = mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversation"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        from: {
            type: String,
            require: true
        },
        to: {
            type: String,
            require: true
        },
        message: {
            type: String
        },
        timestamp: {
            type: Number
        },
        attachments: {
            type: Array
        }
    },
    { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;