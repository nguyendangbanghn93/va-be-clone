const mongoose = require("mongoose");
const { ProjectNames } = require("../Enums");
const stringeeSchema = mongoose.Schema(
    {
        userId: {
            type: String,
        },
        stringeeId: {
            type: String,
        },
        projectName: {
            type: String,
            enum: Object.keys(ProjectNames),
        }
    },
    { timestamps: true }
);
const Stringee = mongoose.model("Stringee", stringeeSchema);
module.exports = Stringee;
