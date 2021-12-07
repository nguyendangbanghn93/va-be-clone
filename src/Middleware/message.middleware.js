const { errorHandler } = require("../Utils/ResponseHandler");
const err = require("../Errors/index");
const { RoleProject } = require("../Enums");
const val = require("./validators.middleware");
const msgConfig = require("../../config/message.config");
const checkHeaderContainCorrectSecretKey = (req, res) => {
    if (req.headers.secretkey !== msgConfig.secretKey)
        // return errorHandler(res, err.MESSAGE_API_KEY_WRONG);
        throw val.bindError(err.MESSAGE_API_KEY_WRONG)
}
const checkAIRespondIsAllowed = (req, res) => {
    if (!msgConfig.enableAiSend) {
        // return errorHandler(res, err.MESSAGE_API_BAN_AI);
        throw val.bindError(err.MESSAGE_API_BAN_AI)
    }
}
const preCheckAiMessage = (req, res, next) => {
    debugger;
    try {
        checkHeaderContainCorrectSecretKey(req);
        checkAIRespondIsAllowed(req);
        next();
    } catch (error) {
        return errorHandler(res, error);
    }
};
module.exports = { preCheckAiMessage };
