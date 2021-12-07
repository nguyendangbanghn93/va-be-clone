const VaConfig = require("../Models/vaConfig.model");
const val = require("../Middleware/validators.middleware");
const request = require('request-promise');
const err = require("../Errors/index");

module.exports.getChannelConfig = async (channelId) => {
    debugger;
    try {
        const channelConfig = await VaConfig.findOne({ channel: channelId });
        // if (!channelConfig || channelConfig.length > 1) {
        //     throw val.bindError(err.VA_EXIST_FOR_2_CHANNELS_OR_NOT_CONFIGURED);
        // }
        return channelConfig;
    } catch (error) {
        throw error;
    }
}

module.exports.sendMessageToAi = async (customerId, channel, msg) => {
    try {
        const body = {
            sender: customerId,
            message: msg
        }
        const res = await request({
            method: 'POST',
            uri: channel.path,
            body,
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'authorization': channel.password
            }
        })
        return res
    } catch (error) {
        debugger;
        return error;
    }
}