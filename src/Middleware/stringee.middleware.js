const { errorHandler } = require("../Utils/ResponseHandler");
const err = require("../Errors/index");
const { ProjectNames } = require("../Enums");
const security = { // gửi đúng projectSecretKey
    FBANG_FTECH_AI: {
        name: ProjectNames.FBANG,
        domain: ["fbang.com", "fbang.tv"] //mở cho những domain này
    },
    FUNZY_FTECH_AI: {
        name: ProjectNames.FUNZY,
        domain: ["funzy.com", "funzy.tv"]
    }
};

const stringeeMiddleware = async (req, res, next) => {
    try {
        const project = security[req.headers.projectSecretKey];
        if (!!project && project.domain.includes(req.headers.domain)) {
            next()
        } else {
            return errorHandler(res, err.NOT_AUTHORIZED);
        }
    } catch (error) {
        return errorHandler(res, error);
    }
};
module.exports = stringeeMiddleware;
