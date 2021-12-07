const Channel = require("../Models/channel.model");

module.exports.getAccessToken = async (channelId) => {
    try {
        const { accessToken } = await Channel.findOne({ id: channelId }).select("accessToken -_id");
        return accessToken
    } catch (error) {
        console.log(error);
    }
}
module.exports.getChannelDetail = async (channelId) => {
    try {
        return await Channel.findOne({ _id: channelId });
    } catch (error) {
        console.log(error);
    }
}