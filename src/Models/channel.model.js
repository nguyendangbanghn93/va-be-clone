const mongoose = require("mongoose");
const { Status, TypeChannel } = require("../Enums");
const err = require("../Errors/index");
const channelSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: Object.keys(TypeChannel),
        },
        _id: {
            type: String,
        },
        name: {
            type: String,
        },
        accessToken: {
            type: String,
        },
        avatar: {
            type: String,
        },
        conversations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversation",
        }],
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project",
        },
        isEnableMessage: {
            type: Boolean,
            default: true,
        },
        vaConfig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vaconfig",
        },
        status: {
            type: String,
            enum: Object.keys(Status),
            default: Status.ACTIVE,
        },
    },
    { timestamps: true, _id: false }
);
const Channel = mongoose.model("channel", channelSchema);
module.exports = Channel;
