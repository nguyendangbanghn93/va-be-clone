const Joi = require("joi");
const { errorHandler } = require("../Utils/ResponseHandler")
const err = require("../Errors/index");
const { Gender, RoleProject } = require("../Enums");
const bindError = (error_data) => {
  result = new Error(error_data.messageCode);
  result.success = error_data.success;
  result.data = error_data.data;
  result.message = error_data.message;
  result.code = error_data.code;
  result.messageCode = error_data.messageCode;
  result.status = error_data.status;
  return result;
}

const reg = {
  name: new RegExp(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{2,}$/
  ),
  phone: new RegExp(
    /^((09[0-9]{8})|(08([1-9])[0-9]{7})|(01(2|6|8|9)[0-9]{8})|(069[2-9][0-9]{4,5})|(080(4|31|511|8)[0-9]{4})|(0([2-8])[0-9]{1,2}[0-9]{1,3}[0-9]{5}))$/
  ),
  image: new RegExp(/([/|.|\w|\s|-])*\.(?:jpg|gif|png)/),
};
const Validators = {
  register: Joi.object({
    // avatar: Joi.string().pattern(reg.image),
    email: Joi.string().email().lowercase()
      .error(e => new Error(err.INVALID_EMAIL.messageCode)),
    password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
      .error(e => new Error(err.PASSWORD_INVALID.messageCode)),
    password_confirmation: Joi.any().equal(Joi.ref("password")).required()
      .error(e => new Error(err.PASSWORD_CONFIRM_DOES_NOT_MATCH.messageCode)),
    // firstName: Joi.string().pattern(reg.name),
    // lastName: Joi.string().pattern(reg.name),
    // gender: Joi.string().valid("MALE", "FEMALE", "UNKNOWN"),
    // phoneNumber: Joi.string().pattern(reg.phone),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase()
      .error(e => new Error(err.INVALID_EMAIL.messageCode)),
    password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
      .error(e => new Error(err.PASSWORD_INVALID.messageCode)),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  update: Joi.object({
    avatar: Joi.string().pattern(reg.image)
      .error(e => new Error(err.INVALID_IMAGE.messageCode)),
    username: Joi.string().pattern(reg.name),
    gender: Joi.string().valid(...Object.keys(Gender)),
    phoneNumber: Joi.string().pattern(reg.phone)
      .error(e => new Error(err.INVALID_PHONE.messageCode)),
  }),

  updatePassword: Joi.object({
    old_password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
      .error(e => new Error(err.PASSWORD_INVALID.messageCode)),
    new_password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
      .error(e => new Error(err.PASSWORD_INVALID.messageCode)),
    new_password_confirmation: Joi.any().equal(Joi.ref("new_password"))
      .error(e => new Error(err.PASSWORD_CONFIRM_DOES_NOT_MATCH.messageCode)),
  }),
  active: Joi.object({
    activeEmailToken: Joi.string().required(),
  }),

  resendEmailActive: Joi.object({
    email: Joi.string().email().lowercase().required()
      .error(e => new Error(err.INVALID_EMAIL.messageCode)),
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().required()
      .error(e => new Error(err.INVALID_EMAIL.messageCode)),
  }),
  resetPassword: Joi.object({
    resetPasswordToken: Joi.string().required(),
    newPassword: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
      .error(e => new Error(err.PASSWORD_INVALID.messageCode)),
    newPasswordConfirmation: Joi.string().required().equal(Joi.ref("newPassword"))
      .error(e => new Error(err.PASSWORD_CONFIRM_DOES_NOT_MATCH.messageCode)),
  }),

  createProject: Joi.object({
    name: Joi.string().min(2).required(true),
    // users: Joi.array().items({
    //   role: Joi.string().valid(...Object.keys(RoleProject)).required(),
    //   userId: Joi.string().required(),
    // }).required(true).unique((a, b) => a.userId === b.userId)
  }),

  createMessage: Joi.object({
    conversationId: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MESSAGE_FIELD_CONV_ID_WRONG);
    }),
    from: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MESSAGE_FIELD_FROM_WRONG);
    }),
    to: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MESSAGE_FIELD_TO_WRONG);
    }),
    message: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MESSAGE_FIELD_MESSAGE_WRONG);
    }),
  }),
  createVaConfig: Joi.object({
    type: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MISSING_TYPE_VA_CONF);
    }),
    name: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MISSING_NAME_VA_CONF);
    }),
    password: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MISSING_PWD_VA_CONF);
    }),
    channel: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MISSING_CHANNEL_VA_CONF);
    }),
    path: Joi.string().min(2).required(true).error(e => {
      return bindError(err.MISSING_VA_CONFIG_PATH);
    }),
  }),
  addUsers: Joi.object({
    users: Joi.array().items({
      role: Joi.string().valid(...Object.keys(RoleProject)).required(),
      userId: Joi.string().required(),
    }).min(1).required(true).unique((a, b) => a.userId === b.userId),
  }),



  removeUsers: Joi.object({
    users: Joi.array().items(Joi.string().required()).min(1).required(true),
  }),

  updateRoleUsers: Joi.array().items({
    role: Joi.string().valid(...Object.keys(RoleProject)).required(),
    userId: Joi.string().required(),
  }).min(1).required(true).unique((a, b) => a.userId === b.userId),

  updateName: Joi.object({
    name: Joi.string().min(2).required(true),
  }),

  removeChannels: Joi.object({
    idChannelsDelete: Joi.array().items(Joi.string().required()).min(1).required(true),
  })
};
const middleware = (validator) => {
  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      return errorHandler(res, error)
    }
  };
};

module.exports = {
  auth: {
    login: middleware("login"),
    register: middleware("register"),
    refreshToken: middleware("refreshToken"),
    update: middleware("update"),
    updatePassword: middleware("updatePassword"),
    active: middleware("active"),
    resendEmailActive: middleware("resendEmailActive"),
    forgotPassword: middleware("forgotPassword"),
    resetPassword: middleware("resetPassword"),
  },
  project: {
    create: middleware("createProject"),
    addUsers: middleware("addUsers"),
    removeUsers: middleware("removeUsers"),
    updateRoleUsers: middleware("updateRoleUsers"),
    updateName: middleware("updateName"),
    removeChannels: middleware("removeChannels"),
  },
  message: {
    create: middleware("createMessage"),

  },
  vaConfig: {
    create: middleware("createVaConfig"),

  },
  bindError,
};
