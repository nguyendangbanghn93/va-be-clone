const VaConfig = require("../Models/vaConfig.model");
const conn = require("../db/index")

const err = require("../Errors/index");
const { successHandler, errorHandler } = require("../Utils/ResponseHandler");
const Channel = require("../Models/channel.model");
const { sendMessageToAi } = require("../Utils/AiUtils");


module.exports.createVaConfig = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const { body } = req;
            const testVaMessage = await sendMessageToAi('va-crm-test', body, 'test_message')
            if (testVaMessage?.error) {
                return res.status(200).json({
                    success: err.UNKNOWN_ERROR.success,
                    data: null,
                    message: `VA config error: ${testVaMessage?.message}`,
                    code: 1100,
                    messageCode: "SEND_VA_ERROR",
                })
            }
            let vaConfig
            vaConfig = await VaConfig.findOneAndUpdate(
                { channel: body.channel },
                body,
                { session }
            )
            if (!vaConfig) {
                vaConfig = new VaConfig(body);
                await vaConfig.save({ session });
            }
            const channel = await Channel.findOneAndUpdate(
                { _id: body.channel },
                { vaConfig: vaConfig._id },
                { session }
            )//.populate("vaConfig", "-password -channel -__v -createdAt -updatedAt")
            if (!channel) return errorHandler(res, err.CHANNEL_NOT_FOUND)
            successHandler(res, vaConfig, 201);
        });
        session.endSession();
    } catch (error) {
        debugger;
        console.log(error);
        return errorHandler(res, error)
    }
};
module.exports.getVaConfig = async (req, res) => {
    try {
        const { body } = req;
        const result = await VaConfig.find({ channel: body.channel });
        successHandler(res, { result }, 200);
    } catch (error) {
        debugger;
        console.log(error);
        return errorHandler(res, error)
    }
}
