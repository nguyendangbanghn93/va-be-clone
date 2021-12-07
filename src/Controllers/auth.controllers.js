const bcrypt = require("bcryptjs");
const User = require("../Models/user.model");
const authConfig = require("../../config/auth.config");
const err = require("../Errors/index");
const { successHandler, errorHandler } = require("../Utils/ResponseHandler")
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Status } = require("../Enums");
const Project = require("../Models/project.model");
const conn = require("../db");

exports.register = async (req, res, next) => {
  try {
    const userDb = await User.findOne({ email: req.body.email })
    if (userDb)
      return errorHandler(res, err.EMAIL_DUPLICATED)
    const user = new User(req.body);
    if (authConfig.isActiveByMail) {
      const activeToken = await sendActiveEmail(req, user)
      user.activeEmailToken = activeToken;
      user.activeEmailExpires = Date.now() + authConfig.activeEmailLife;
    }
    await user.save();
    return successHandler(res, null, 200)

  } catch (error) {
    if (error.code === 11000)
      return errorHandler(res, err.EMAIL_DUPLICATED, error)
    return errorHandler(res, error)
  }
};

exports.active = async (req, res, next) => {
  try {
    const { activeEmailToken } = new User(req.body);
    const user = await User.findOne({ activeEmailToken });
    if (!user)
      return errorHandler(res, err.TOKEN_WRONG)
    if (user.status == 'ACTIVE')
      return errorHandler(res, err.ACCOUNT_ACTIVED)

    const expiresDate = new Date(user.activeEmailExpires)
    const now = new Date()

    if (user.activeEmailToken != activeEmailToken)
      return errorHandler(res, err.TOKEN_WRONG)
    if (expiresDate < now)
      return errorHandler(res, err.TOKEN_EXPIRED)

    user.activeEmailToken = null
    user.activeEmailExpires = null
    user.status = 'ACTIVE'
    user.save()
    const { token, refreshToken } = await user.generateAuthToken();
    return successHandler(res, { token, refreshToken, user }, 201)
  } catch (error) {
    return errorHandler(res, error)
  }
}

exports.resendEmailActive = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user)
      return errorHandler(res, err.EMAIL_NOT_EXIST)

    if (user.status == 'ACTIVE')
      return errorHandler(res, err.ACCOUNT_ACTIVED)

    const activeToken = await sendActiveEmail(req, user)
    user.activeEmailToken = activeToken;
    user.activeEmailExpires = Date.now() + authConfig.activeEmailLife;
    await user.save();
    return successHandler(res, null, 200)
  } catch (error) {
    return errorHandler(res, error)
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findByCredentials(email, password)

    if (!user)
      return errorHandler(err.LOGIN_FAILED)

    const { token, refreshToken } = await user.generateAuthToken();
    return successHandler(res, { user, token, refreshToken }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const data = await User.verifyJwtRefreshToken(req?.body?.refreshToken);
    const user = await User.findOne({
      status: Status.ACTIVE,
      _id: data?.user?._id,
    });
    if (!user)
      return errorHandler(res, err.USER_NOT_FOUND)
    const { token, refreshToken } = await user.generateAuthToken();
    return successHandler(res, { token, refreshToken }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const session = await conn.startSession();
    await session.withTransaction(async () => {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        useFindAndModify: false,
      });
      if (!user)
        return errorHandler(err.USER_NOT_FOUND)
      const project = await Project.updateMany({ _id: { $in: user.projects.map(p => p.projectId) } }, {
        $set: {
          "users.$[e].username": user.username,
        }
      }, {
        arrayFilters: [{ "e.userId": user._id }],
      })
      return successHandler(res, { user, project }, 200)
    })
    session.endSession();
  } catch (error) {
    return errorHandler(res, error)
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const isPasswordMatch = await bcrypt.compare(req?.body?.old_password, req?.user?.password);
    if (!isPasswordMatch)
      return errorHandler(res, err.INCORRECT_PASSWORD)
    const password = await bcrypt.hash(req?.body?.new_password, authConfig.salt);
    const user = await User.findByIdAndUpdate(req.user._id, { password }, {
      new: true,
    });
    if (!user)
      return errorHandler(res, err.USER_NOT_FOUND)
    return successHandler(res, { user }, 200)
  } catch (error) {
    return errorHandler(res, error)
  }
};

exports.getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return errorHandler(res, err.USER_NOT_FOUND)
    return successHandler(res, { user }, 200)
  } catch (error) {
    if (error.kind === "ObjectId")
      return errorHandler(res, err.ID_INVALID)
    return errorHandler(res, error)
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return errorHandler(res, err.EMAIL_NOT_EXIST)
    const resetPasswordToken = await sendForgotEmail(req, user)
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + authConfig.activeEmailLife;
    user.save();

    return successHandler(res, {}, 200, "An email has send to your email. Please check your email")
  } catch (error) {
    if (error.code === 11000)
      return errorHandler(res, err.EMAIL_DUPLICATED, error)
    return errorHandler(res, error)
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken })
    if (!user)
      return errorHandler(res, err.TOKEN_WRONG)

    const expiresDate = new Date(user.resetPasswordExpires)
    const now = new Date()

    if (expiresDate < now)
      return errorHandler(res, err.TOKEN_EXPIRED)
    const password = await bcrypt.hash(newPassword, authConfig.salt);
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    user.password = password
    user.save()
    return successHandler(res, { user }, 200)

  } catch (error) {
    if (error.code === 11000)
      return errorHandler(res, err.EMAIL_DUPLICATED, error)
    return errorHandler(res, error)
  }
}


const sendActiveEmail = async (req, user) => {
  const activeToken = crypto.randomBytes(20).toString("hex");
  const smtpTrans = nodemailer.createTransport({
    service: authConfig.emailService,
    host: authConfig.emailHost,
    auth: {
      user: authConfig.emailUser,
      pass: authConfig.emailPass,
    },
  });
  const domain = req?.headers?.origin;
  // if (!domain)
  //   throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    to: user.email,
    from: "Admin",
    subject: "Active your email",
    text:
      "You are receiving this because you (or someone else) have requested active your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      domain + "/active/" + activeToken +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  const send = await smtpTrans.sendMail(mailOptions);

  if (!send)
    throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return activeToken
}

const sendForgotEmail = async (req, user) => {
  const token = crypto.randomBytes(20).toString("hex");
  const smtpTrans = nodemailer.createTransport({
    service: authConfig.emailService,
    host: authConfig.emailHost,
    auth: {
      user: authConfig.emailUser,
      pass: authConfig.emailPass,
    },
  });
  const domain = req?.headers?.origin;
  // if (!domain)
  //   throw new Error(err.SEND_MAIL_ERROR.messageCode);
  const mailOptions = {
    to: user.email,
    from: "Admin",
    subject: "Password Reset",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      domain + "/reset_password/" + token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  const send = await smtpTrans.sendMail(mailOptions);

  if (!send)
    throw new Error(err.SEND_MAIL_ERROR.messageCode);
  return token
}
