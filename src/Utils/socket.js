
const { Status } = require("../Enums");
const Channel = require("../Models/channel.model");
const Conversation = require("../Models/conversation.model");
const User = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");
const { sendMessage } = require("./FacebookAPI");
const err = require("../Errors/index");

module.exports = async (io) => {
    try {
        io.use(async (socket, next) => {
            if (socket.handshake.auth && socket.handshake.auth.token) {
                const token = socket.handshake.auth.token;
                try {
                    const data = await jwt.verify(token, authConfig.secret);
                    const user = await User.findOne({
                        status: Status.ACTIVE,
                        _id: data.user._id,
                        "tokens.token": token,
                    });
                    if (!user)
                        next(new Error(JSON.stringify(err.TOKEN_EXPIRED)))
                    else
                        next();
                } catch (error) {
                    next(new Error(JSON.stringify(err.TOKEN_EXPIRED)))
                }
            } else {
                next(new Error(JSON.stringify(err.TOKEN_WRONG)))
            }
        });
        io.on('connection', async (socket) => {
            console.log('new connection')
            socket.on('join_channel', async channelId => {
                const channel = await Channel.exists({ _id: channelId })
                if (channel) {
                    socket.join(`channel_${channelId}`)
                    io.to(socket.id).emit('notification', 'Join channel success')
                }
                else
                    io.to(socket.id).emit('error', JSON.stringify(err.CHANNEL_NOT_FOUND))
            })

            socket.on('leave_channel', async channelId => {
                const channel = await Channel.exists({ _id: channelId })
                if (channel) {
                    socket.leave(`channel_${channelId}`)
                    io.to(socket.id).emit('notification', 'Leave channel success')
                }
                else
                    io.to(socket.id).emit('error', JSON.stringify(err.CHANNEL_NOT_FOUND))
            })

            socket.on('join_conversation', async conversationId => {
                const conversation = await Conversation.exists({ _id: conversationId })
                if (conversation) {
                    socket.join(`conversation_${conversationId}`)
                    io.to(socket.id).emit('notification', 'Join conversation success')
                }
                else
                    io.to(socket.id).emit('error', JSON.stringify(err.CONVERSATION_NOT_FOUND))
            })

            socket.on('leave_conversation', async conversationId => {
                const conversation = await Conversation.exists({ _id: conversationId })
                if (conversation) {
                    socket.leave(`conversation_${conversationId}`)
                    io.to(socket.id).emit('notification', 'Leave conversation success')
                }
                else
                    io.to(socket.id).emit('error', JSON.stringify(err.CONVERSATION_NOT_FOUND))
            })

            socket.on('send_message', async data => {
                const { conversationId, message } = data
                const conversation = await Conversation.findOne({ _id: conversationId })
                if (!conversation) {
                    io.to(socket.id).emit('error', JSON.stringify(err.CONVERSATION_NOT_FOUND))
                } else {
                    const channel = await Channel.findOne({ _id: conversation.channel })
                    const res = await sendMessage(conversation.customer, channel?.accessToken, message)
                    if (res?.error) {
                        io.to(socket.id).emit('error', JSON.stringify({
                            status: 200,
                            success: false,
                            data: null,
                            message: res?.error?.error?.message,
                            code: res?.error?.error?.code,
                            messageCode: "SEND_MESSAGE_ERROR",
                        }))

                    }
                }
            })
        })
        return io
    } catch (error) {
        console.log(`error`, error)
    }
}