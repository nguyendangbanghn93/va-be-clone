const mongoose = require("mongoose");
const { TypeChannel } = require("../Enums");
const customerSchema = mongoose.Schema(
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
        avatar: {
            type: String,
        },
        gender: {
            type: String,
        },
        timezone: {
            type: String,
        },
        locale: {
            type: String,
        },
        chanel:{
            type: String,
        }
    },
    { timestamps: true, _id: false }
);
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
