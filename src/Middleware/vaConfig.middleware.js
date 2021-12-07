const VaConfig = require("../Models/vaConfig.model");
const { errorHandler } = require("../Utils/ResponseHandler");
const err = require("../Errors/index");
const { TypeVA } = require("../Enums");
const val = require("./validators.middleware");

const checkVaConfigIsUnique = async (req, res) => {
    debugger;
    const body = req.body;
    const isExist = await VaConfig.exists({ channel: body.channel });
    if (isExist) {
        throw val.bindError(err.VA_EXIST_FOR_CHANNEL);
    }

}

const checkTypeVaConfig = async (req, res, next) => {
    const body = req.body;
    debugger;
    if (body.type != TypeVA.RASA && body.type != TypeVA.COMET) {
        throw val.bindError(err.INVALID_TYPE_VA_TYPE);
    }
}
const preCheckVaConfig = async (req, res, next) => {
    debugger;
    try {
        // await checkVaConfigIsUnique(req);
        await checkTypeVaConfig(req);
        next();
    } catch (error) {
        return errorHandler(res, error);
    }
};
module.exports = { preCheckVaConfig };
