module.exports = {
    facebook_key: "2615649528536155",
    facebook_secret: "633a01934b9374d7794c99ed71e26c2e",
    callback_url: `${process.env.DOMAIN || "https://api.va-crm.dev.ftech.ai"}/v1/api/projects/connect_facebook/callback`,
    fb_graph_api_url: 'https://graph.facebook.com'
}