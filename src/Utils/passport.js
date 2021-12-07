const passport = require('passport')
const request = require('request-promise');
const facebookConfig = require("../../config/facebook.config");
const FacebookStrategy = require('passport-facebook').Strategy;
const err = require("../Errors/index");
const { TypeChannel } = require('../Enums');
const { registerWebhookEvent } = require('./FacebookAPI');

try {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookConfig.facebook_key,
        clientSecret: facebookConfig.facebook_secret,
        callbackURL: facebookConfig.callback_url,
        profileFields: ["email", "name"],
        passReqToCallback: true,
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          const res = await request({
            method: 'GET',
            uri: `https://graph.facebook.com/${profile.id}/accounts?access_token=${accessToken}`,
          });
          const parsedRes = JSON.parse(res);
          return done(null, { page: parsedRes?.data, query: req.query.state });
        } catch (error) {
          done(err.CONNECT_FACEBOOK_FAIL, error);
        }
      }
    )
  );
} catch (error) {
  console.log(error)
}