const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");
const err = require("../Errors/index");
const { Status, RoleSystem, Gender, RoleProject } = require("../Enums");
String.prototype.isPhoneNumber = function () {
  const t = String(this);
  const r = new RegExp(
    /^((09[0-9]{8})|(08([1-9])[0-9]{7})|(01(2|6|8|9)[0-9]{8})|(069[2-9][0-9]{4,5})|(080(4|31|511|8)[0-9]{4})|(0([2-8])[0-9]{1,2}[0-9]{1,3}[0-9]{5}))$/
  );
  return r.test(t);
};
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value))
          throw new Error(err.INVALID_EMAIL.messageCode);
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: (value) => {
        if (!value.isPhoneNumber())
          throw new Error(err.INVALID_PHONE.messageCode);
      },
    },
    avatar: {
      type: String,
      validate: (value) => {
        if (!/([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(value))
          throw new Error(err.INVALID_IMAGE.messageCode);
      },
    },
    username: {
      trim: true,
      type: String,
    },
    gender: {
      type: String,
      enum: Object.keys(Gender),
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    activeEmailToken: String,
    activeEmailExpires: Date,
    projects: [{
      role: {
        type: String,
        enum: Object.keys(RoleProject),
      },
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      projectName: {
        type: String,
      },
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      enum: Object.keys(RoleSystem),
      default: RoleSystem.USER,
    },
    status: {
      type: String,
      enum: Object.keys(Status),
      default: Status.DEACTIVE,
    },
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: function (doc, ret, opt) {
    try {
      delete ret["password"];
      delete ret["tokens"];
      delete ret["__v"];
      if (doc.fullName) ret["fullName"] = doc.fullName;
    } catch (e) { }
    return ret;
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, authConfig.salt);
  }
  next();
});
userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  this.options.runValidators = true;
  next();
});
userSchema.post(['updateOne', "update", "updateMany", 'findOneAndUpdate'], async function (user) {

});
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ user: user.toJSON() }, authConfig.secret, {
    expiresIn: authConfig.tokenLife,
  });
  const refreshToken = jwt.sign(
    { user: user.toJSON() },
    authConfig.refreshTokenSecret,
    {
      expiresIn: authConfig.refreshTokenLife,
    }
  );
  return { token, refreshToken, user };
};
const verifyJwt = async (token, secret) => {
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    // if (error.message === "jwt expired")
    throw new Error(err.INVALID_TOKEN.messageCode)
    // throw new Error(error)
  }
}

userSchema.statics.verifyJwtToken = async (token) => await verifyJwt(token, authConfig.secret)
userSchema.statics.verifyJwtRefreshToken = async (token) => await verifyJwt(token, authConfig.refreshTokenSecret)

userSchema.statics.findByCredentials = async (email, password) => {
  let user = await User.findOne({ email });
  if (!user) {
    throw new Error(err.LOGIN_INVALID.messageCode);
  }
  if (authConfig.isActiveByMail) {
    if (user.status !== Status.ACTIVE) {
      throw new Error(err.ACCOUNT_DEACTIVE.messageCode);
    }
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error(err.LOGIN_INVALID.messageCode);
  }

  return user;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
