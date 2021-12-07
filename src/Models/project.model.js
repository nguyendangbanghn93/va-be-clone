const mongoose = require("mongoose");
const { Status, RoleProject, TypeChannel } = require("../Enums");
const err = require("../Errors/index");
const projectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            // unique: true,
        },
        users: {
            type: [
                {
                    role: {
                        type: String,
                        enum: Object.keys(RoleProject),
                    },
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    username: {
                        type: String,
                    },
                    email: {
                        type: String
                    }
                },
            ],
        },
        channels: [{
            type: String,
            ref: "channel",
        }],
        status: {
            type: String,
            enum: Object.keys(Status),
            default: Status.ACTIVE,
        },
    },
    { timestamps: true }
);
projectSchema.pre(['updateOne', "update", "updateMany", 'findOneAndUpdate'], function (next) {
    this.options.runValidators = true;
    let userUpdate = this.getUpdate()?.$addToSet?.users?.$each;
    if (userUpdate?.length) {
        (async () => {
            const User = mongoose.model('User');
            const users = (await User.find({
                _id: {
                    $in: userUpdate.map(u => u.userId)
                },
            })).reduce(function (map, user) {
                map[user._id] = user;
                return map;
            }, {});
            if (Object.keys(users)?.length !== userUpdate?.length)
                throw new Error(err.USER_INVALID.messageCode)
            userUpdate.map((u, i) => {
                userUpdate[i] = {
                    role: u.role,
                    userId: u.userId,
                    username: users?.[u.userId]?.username,
                    email: users?.[u.userId]?.email,
                }
            })
            next();
        })()
    } else {
        next();
    }
});
projectSchema.methods.uniqueUsers = function () {
    var unique = this.users.map(u => u.userId?.toString()).filter((v, i, a) => a.indexOf(v) === i);
    if (unique.length !== this.users.length)
        throw new Error(err.USER_DUPLICATED_IN_PROJECT.messageCode)
}

projectSchema.methods.isExistAdmin = function () {
    const userField = this.users;
    if (!userField?.find(u => u.role === RoleProject.ADMIN) && this.status === Status.ACTIVE)
        throw new Error(err.ADMIN_DOES_NOT_EXIST.messageCode)
}
projectSchema.post(['save', 'updateOne', 'findOneAndUpdate'], function (project) {
    if (!project) throw new Error(err.PROJECT_NOT_FOUND.messageCode);
    project.uniqueUsers();
    project.isExistAdmin();
});
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
