const User = require("../Models/user.model");
const err = require("../Errors/index")
const { errorHandler } = require("../Utils/ResponseHandler");
const { Status, RoleSystem } = require("../Enums");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return errorHandler(res, err.INVALID_TOKEN);
    const data = await User.verifyJwtToken(token);
    const user = await User.findOne({
      status: Status.ACTIVE,
      _id: data.user._id,
      "tokens.token": token,
    });
    if (!user)
      return errorHandler(res, err.INVALID_TOKEN);
    req.user = user;
    req.token = token;
    req.isAdmin = () => {
      if (user.role === RoleSystem.ADMIN) return true;
      return errorHandler(res, err.ONLY_USER);
    };
    req.isUser = () => {
      if (user.role === RoleSystem.USER || user.role === RoleSystem.ADMIN) return true;
      return errorHandler(res, err.ONLY_ADMIN);
    };
    next();
  } catch (error) {
    return errorHandler(res, error);
  }
};
module.exports = auth;
