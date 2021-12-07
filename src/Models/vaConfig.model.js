const mongoose = require("mongoose");
const { TypeVA } = require("../Enums");
const err = require("../Errors/index");
const vaConfigSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: Object.keys(TypeVA),
        },
        name: {
            type: String,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
        },
        channel: {
            type: String,
            ref: "Channel",
        },
        isEnable: {
            type: Boolean,
        },
        path: {
            type: String,
        },
    },
    { timestamps: true, }
);
const VaConfig = mongoose.model("vaconfig", vaConfigSchema);
module.exports = VaConfig;
