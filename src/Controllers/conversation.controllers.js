
const Conversation = require("../Models/conversation.model");
const err = require("../Errors/index");
const { errorHandler, successHandler } = require("../Utils/ResponseHandler");
const { getChannelDetail } = require("./channel.controllers");
var ObjectID = require('mongodb').ObjectID;


module.exports.findOneOrCreateConversation = async (channelId, customerId) => {
    try {
        let conversation = await Conversation.findOne({ channel: channelId, customer: customerId });
        if (!conversation) {
            const channel = await getChannelDetail(channelId);
            if (!channel?.project) throw new Error();
            conversation = new Conversation({
                project: channel?.project,
                channel: channelId,
                customer: customerId,
            })
            await conversation.save();
            channel.conversations.push(conversation._id);
            await channel.save();
        }
        return conversation
    } catch (error) {
        console.log(error);
    }
}
module.exports.getConversationByChannel = async (req, res) => {
    try {
        let { channelId, page = 1, limit = 10, customerName = '' } = req?.query
        page = page * 1;
        limit = limit * 1
        const skip = (page - 1) * limit;
        const condition = [
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customerDetail"
                }
            },
            {
                $match: { channel: channelId, "customerDetail.name": new RegExp(customerName, "i") }
            },
        ];
        const [{ total = 0 } = {}] = await Conversation.aggregate([...condition,
        {
            $count: "total"
        },
        ]);
        let conversations = await Conversation.aggregate([...condition,
        {
            $sort: { updatedAt: -1 }
        },
        {
            $limit: limit
        },
        {
            $skip: skip
        },
        {
            $addFields: { lastMessage: { $arrayElemAt: ["$messages", -1] } }
        },
        {
            $lookup: {
                from: "messages",
                localField: "lastMessage",
                foreignField: "_id",
                as: "lastMessageDetail"
            },
        },
        {
            $lookup: {
                from: "channels",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetail"
            },
        },
        { $unwind: '$channelDetail' },
        { $unwind: '$lastMessageDetail' },
        { $unwind: '$customerDetail' },
        {
            $unset: ["messages", "lastMessage", "channel", "channelDetail.conversations", "channelDetail.accessToken"]
        }
        ]);
        successHandler(res, {
            conversations,
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
module.exports.detail = async (req, res) => {
    try {
        let conversation = await Conversation.aggregate([
            {
                $match: { _id: new ObjectID(req.params.id) }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customerDetail"
                }
            },
            {
                $lookup: {
                    from: "channels",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channelDetail"
                },
            },
            { $unwind: '$channelDetail' },
            { $unwind: '$customerDetail' },
            {
                $unset: ["messages", "users", "createdAt", "updatedAt", "lastMessage", "__v", "customer", "channel","channelDetail.accessToken","channelDetail.conversations","channelDetail.createdAt","channelDetail.updatedAt"]
            }
        ]);
        if (conversation?.length < 1) return errorHandler(res, err.CONVERSATION_NOT_FOUND);
        conversation = conversation[0];
        const channelDetail = conversation.channelDetail;
        delete conversation.channelDetail;
        successHandler(res, { conversation: conversation, channelDetail: channelDetail });
    } catch (error) {
        debugger;
        console.log(error);
        return errorHandler(res, error)
    }
}