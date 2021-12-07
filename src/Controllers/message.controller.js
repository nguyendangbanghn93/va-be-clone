const Message = require("../Models/message.model");

const err = require("../Errors/index");
const conn = require("../db/index")
const { successHandler, errorHandler } = require("../Utils/ResponseHandler");
const msgConfig = require("../../config/message.config");

module.exports.create = async (req, res) => {
    try {
        const { body } = req;
        const message = new Message(body);
        await message.save();
        successHandler(res, message);
    } catch (error) {
        debugger;
        console.log(error);
        return errorHandler(res, error)
    }
};
module.exports.getMessageByConversation = async (req, res) => {
    try {
        let { conversationId, page = 1, limit = 10 } = req?.query
        limit = limit * 1
        page = page * 1;
        const skip = (page - 1) * limit;
        const messages = await Message.find({ conversation: conversationId }).select("attachments from to message timestamp").sort({ timestamp: -1 }).limit(limit).skip(skip);
        const total = await Message.count({ conversation: conversationId });
        successHandler(res, {
            messages,
            paginate: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        debugger;
        console.log(error);
        return errorHandler(res, error)
    }
}
