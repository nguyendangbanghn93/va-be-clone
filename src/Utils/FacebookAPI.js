const request = require('request-promise');
const facebookConfig = require("../../config/facebook.config");

exports.registerWebhookEvent = async (pageId, pageAccessTokens) => {
    const subscribed_fields =
        [
            "messages",
            "messaging_postbacks",
            "messaging_optins",
            "message_deliveries",
            "message_reads",
            "messaging_payments",
            "messaging_pre_checkouts",
            "messaging_checkout_updates",
            "messaging_account_linking",
            "messaging_referrals",
            "message_echoes",
            "messaging_game_plays",
            "standby",
            "messaging_handovers",
            "messaging_policy_enforcement",
            "message_reactions",
            "inbox_labels",
            "feed",
        ].join(',')
    const path = `${pageId}/subscribed_apps?subscribed_fields=${subscribed_fields}&access_token=${pageAccessTokens}`
    const res = await request({
        method: 'POST',
        uri: `${facebookConfig.fb_graph_api_url}/${path}`
    })
    return JSON.parse(res).success
}

exports.sendMessage = async (recipientId, pageAccessToken, message) => {
    try {
        const path = `v12.0/me/messages?access_token=${pageAccessToken}`
        const body = {
            messaging_type: "RESPONSE",
            recipient: {
                id: recipientId
            },
            message: {
                text: message
            }
        }
        const res = await request({
            method: 'POST',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
            body,
            json: true
        })
        return res
    } catch (error) {
        return error
    }
}

exports.getUserProfile = async (profileId, pageAccessToken) => {
    try {
        const path = `${profileId}?fields=name,profile_pic&access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`
        })
        return JSON.parse(res)
    } catch (error) {
        console.log(error);
    }
}

exports.getPageAvatar = async (pageId) => {
    try {
        const path = `${pageId}/picture?width=1920&redirect=0`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        return JSON.parse(res)
    } catch (error) {
        console.log(error);

    }
}

exports.getListConversations = async (pageId, pageAccessToken) => {
    try {
        const path = `${pageId}/conversations&access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        return res
    } catch (error) {

    }
}

exports.getListMessage = async (conversationId, pageAccessToken) => {
    try {
        const path = `${conversationId}/messages?access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        return res
    } catch (error) {

    }
}

exports.getMessage = async (messageId, pageAccessToken) => {
    try {
        const path = `/v9.0/${messageId}?access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        return res
    } catch (error) {

    }
}

exports.getListConversations = async (pageId, pageAccessToken) => {
    try {
        const path = `${pageId}/conversations&access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        console.log(`res`, res)
        return res
    } catch (error) {

    }
}

exports.getListMessage = async (conversationId, pageAccessToken) => {
    try {
        const path = `${conversationId}/messages?access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        return res
    } catch (error) {

    }
}

exports.getMessage = async (messageId, pageAccessToken) => {
    try {
        const path = `/v9.0/${messageId}?access_token=${pageAccessToken}`
        const res = await request({
            method: 'GET',
            uri: `${facebookConfig.fb_graph_api_url}/${path}`,
        })
        return res
    } catch (error) {

    }
}