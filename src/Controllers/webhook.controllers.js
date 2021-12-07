const { TypeChannel } = require("../Enums");
const Channel = require("../Models/channel.model");
const Conversation = require("../Models/conversation.model");
const Customer = require("../Models/customer.model");
const Message = require("../Models/message.model");
const { getUserProfile } = require("../Utils/FacebookAPI");
const { sendMessageToAi, getChannelConfig } = require("../Utils/AiUtils");
const { getAccessToken, getChannelDetail } = require("./channel.controllers");
const { findOneOrCreateConversation } = require("./conversation.controllers");
const { customerExist, createCustomer } = require("./customer.controllers");

module.exports.registerWebhook = async (req, res) => {
    try {
        // Your verify token. Should be a random string.
        let VERIFY_TOKEN = "ftechai"

        // Parse the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        // Checks if a token and mode is in the query string of the request
        if (mode && token) {

            // Checks the mode and token sent is correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {

                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);

            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    } catch (error) {
        res.sendStatus(403);
    }
}

module.exports.recieveDataWebhookSocket = async (req, res, io) => {
    try {
        let body = req.body;
        let newConversation = false
        if (body.object === 'page') {
            const data = body?.entry?.[0]
            if (data.messaging?.[0]?.message) {
                const pageId = data?.id;
                const channel = await getChannelDetail(pageId);
                const message = data.messaging?.[0];
                const customerId = message?.sender?.id === pageId ? message?.recipient?.id : message?.sender?.id
                if (await customerExist(customerId) <= 0 && channel?.accessToken) {
                    const customerInfo = await getUserProfile(customerId, channel?.accessToken);
                    createCustomer(new Customer({
                        type: TypeChannel.FACEBOOK,
                        _id: customerInfo.id,
                        name: customerInfo.name,
                        avatar: customerInfo.profile_pic,
                        gender: customerInfo.gender?.toUpperCase(),
                        timezone: customerInfo.timezone,
                        locale: customerInfo.locale,
                        channel: channel._id
                    }))
                }
                // const conversation = await findOneOrCreateConversation(pageId, customerId);
                let conversation = await Conversation.findOne({ channel: pageId, customer: customerId })
                if (!conversation) {
                    newConversation = true
                    const channel = await getChannelDetail(pageId);
                    if (!channel?.project) throw new Error();
                    conversation = new Conversation({
                        project: channel?.project,
                        channel: pageId,
                        customer: customerId,
                    })
                    await conversation.save();
                    channel.conversations.push(conversation._id);
                    await channel.save();
                }
                if (conversation) {
                    const newMessage = new Message({
                        conversation: conversation._id,
                        from: message?.sender?.id,
                        to: message?.recipient?.id,
                        message: message?.message?.text,
                        timestamp: message?.timestamp,
                        attachments: message?.message?.attachments
                    });
                    await newMessage.save();
                    conversation.messages.push(newMessage._id);
                    await conversation.save();
                    const config = await getChannelConfig(pageId)
                    let vaSuggestion
                    if (config?.path && message?.sender?.id != pageId) {
                        vaSuggestion = await sendMessageToAi(customerId, config, message?.message?.text)
                        if (vaSuggestion?.error) {
                            io.to(`conversation_${conversation._id}`).emit('error', JSON.stringify({
                                status: 200,
                                success: false,
                                data: null,
                                message: `VA config error: ${vaSuggestion?.message}`,
                                code: 1100,
                                messageCode: "SEND_VA_ERROR",
                            }))
                            vaSuggestion = null
                        }
                    }
                    if (newConversation) {
                        const customerDetail = await Customer.findOne({ _id: customerId })
                        const channelDetail = await Channel.findOne({ _id: pageId }).select('-accessToken -conversations')
                        io.to(`channel_${channel._id}`).emit('new_conversation', {
                            ...conversation.toObject(),
                            customerDetail,
                            channelDetail,
                            lastMessageDetail: { ...newMessage.toObject(), vaSuggestion }
                        })
                    }
                    io.to(`channel_${channel._id}`).emit('new_channel_message', { ...newMessage.toObject(), vaSuggestion })
                    io.to(`conversation_${conversation._id}`).emit('new_conversation_message', { ...newMessage.toObject(), vaSuggestion })
                }
            }

            res.status(200).send('EVENT_RECEIVED');
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    } catch (error) {
        console.log(error);

        res.sendStatus(404);
    }
}
