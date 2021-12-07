const User = require("../Models/user.model");
const Project = require("../Models/project.model");
const { RoleProject, Status, TypeChannel } = require("../Enums");
const err = require("../Errors/index");
const conn = require("../db/index")
const { successHandler, errorHandler } = require("../Utils/ResponseHandler");
const passport = require('passport')
const Channel = require("../Models/channel.model");
const { registerWebhookEvent, getMessage, getPageAvatar } = require("../Utils/FacebookAPI");
exports.create = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            let project = new Project({
                ...req.body,
            });
            project.users = [{
                userId: req.user._id,
                role: RoleProject.ADMIN,
                username: req.user.username,
                email: req.user.email,
            }]
            await project.save({ session });
            const user = await User.findOneAndUpdate({ _id: req.user._id, status: Status.ACTIVE }, {
                $addToSet: {
                    projects: [{
                        role: RoleProject.ADMIN,
                        projectId: project._id,
                        projectName: project.name,
                    }]
                }
            }, { new: true, useFindAndModify: false, session })
            successHandler(res, { project, user }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        if (error.code === 11000)
            return errorHandler(res, err.PROJECT_DUPLICATED, error)
        return errorHandler(res, error)
    }
};

exports.delete = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const projectId = req.params.id;
            const project = await Project.findOneAndUpdate({
                _id: projectId,
                status: Status.ACTIVE
            }, {
                status: Status.DELETE,
                users: [],
                channels: [],
            }, { session });
            if (!project) return errorHandler(res, err.PROJECT_NOT_FOUND)
            const users = await Promise.all(
                project.users.map(u => User.findOneAndUpdate({ _id: u.userId, status: Status.ACTIVE }, {
                    $pull: {
                        projects: {
                            projectId: projectId
                        }
                    }
                }, { new: true, useFindAndModify: false, session })
                )
            )
            await Channel.deleteMany({ _id: { $in: project.channels } });
            successHandler(res, { project, users }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};
// exports.create = async (req, res) => {
//     try {
//         const session = await conn.startSession();
//         await session.withTransaction(async () => {
//             let project = new Project({
//                 ...req.body,
//             });
//             await project.save({ session });
//             const users = await Promise.all(
//                 project.users.map(u => {
//                     return User.findByIdAndUpdate(u.userId, {
//                         $addToSet: {
//                             projects: [{
//                                 role: u.role,
//                                 projectId: project._id,
//                                 projectName: project.name,
//                             }]
//                         }
//                     }, { new: true, useFindAndModify: false, session })
//                 })
//             )
//             successHandler(res, { project }, 200)
//         })
//         session.endSession();
//     } catch (error) {
//         console.log(error);
//         if (error.code === 11000)
//             return errorHandler(res, err.PROJECT_DUPLICATED, error)
//         return errorHandler(res, error)
//     }
// };
exports.detail = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findOne({ _id: projectId, status: Status.ACTIVE }).populate({
            path: 'channels',
            select: "-accessToken -createdAt -status -updatedAt -__v",
            populate: {
                path: 'vaConfig',
                select: "-password -channel -createdAt -updatedAt -__v"
            }
        })
        if (!project?.channels?.vaConfig)
            project.channels.vaConfig = null
        if (!project) return errorHandler(res, err.PROJECT_NOT_FOUND.messageCode)
        successHandler(res, { project }, 200)
    } catch (error) {
        console.log(error);
        return errorHandler(res, error)
    }
};
exports.addUsers = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const projectId = req.params.id;
            const project = await Project.findOneAndUpdate({ _id: projectId, status: Status.ACTIVE }, {
                $addToSet: {
                    users: { $each: req?.body?.users }
                }
            }, { new: true, useFindAndModify: false, session });
            if (!project) return errorHandler(res, err.PROJECT_NOT_FOUND)
            const users = await Promise.all(
                req?.body?.users.map(u => User.findOneAndUpdate({ _id: u.userId, status: Status.ACTIVE }, {
                    $addToSet: {
                        projects: [{
                            role: u.role,
                            projectId: project._id,
                            projectName: project.name,
                        }]
                    }
                }, { new: true, useFindAndModify: false, session })
                )
            )
            successHandler(res, { project, users }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};
exports.removeUsers = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const projectId = req.params.id;
            const userIds = req.body.users;
            const project = await Project.findOneAndUpdate({ _id: projectId, status: Status.ACTIVE }, {
                $pull: {
                    users: {
                        userId: { $in: userIds }
                    }
                }
            }, { new: true, useFindAndModify: false, session });
            const users = await Promise.all(
                userIds.map(userId => User.findOneAndUpdate({ _id: userId, status: Status.ACTIVE }, {
                    $pull: {
                        projects: {
                            projectId: projectId
                        }
                    }
                }, { new: true, useFindAndModify: false, session })
                )
            )
            successHandler(res, { project, users }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};
exports.updateRoleUsers = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const projectId = req.params.id;
            const set = {};
            const arrayFilters = [];
            req.body?.map(u => {
                set[`users.$[e${u.userId}].role`] = u.role;
                arrayFilters.push({ [`e${u.userId}.userId`]: u.userId })
            })
            const project = await Project.findOneAndUpdate({ _id: projectId, status: Status.ACTIVE }, {
                $set: set,
            }, {
                arrayFilters,
                new: true,
                useFindAndModify: false,
                session
            });
            const users = await Promise.all(
                req.body.map(u => User.findOneAndUpdate({ _id: u.userId, status: Status.ACTIVE }, {
                    $set: { "projects.$[e].role": u.role }
                }, {
                    arrayFilters: [{ "e.projectId": project._id }],
                    new: true,
                    useFindAndModify: false,
                    session
                })
                )
            )
            successHandler(res, { project, users }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};
exports.updateName = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const project = await Project.findOneAndUpdate({ _id: req.params.id, status: Status.ACTIVE }, { name: req.body.name }, { new: true, useFindAndModify: false, session });
            if (!project) return errorHandler(res, err.PROJECT_NOT_FOUND)
            const users = await User.updateMany({ _id: { $in: project?.users?.map(u => u.userId) } }, {
                $set: {
                    "projects.$[e].projectName": project.name,
                }
            }, {
                arrayFilters: [{ "e.projectId": project._id }],
                new: true,
                useFindAndModify: false,
                session
            })
            successHandler(res, { project }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};
exports.list = async (req, res) => {
    try {
        const projects = await Project.find({
            "users.userId": req.user._id,
            "status": Status.ACTIVE,
        }).populate("channels").limit(1000).skip(0);
        successHandler(res, { projects }, 200)
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
}
exports.addChannels = async (projectId, configChannel) => {
    return await Project.findOneAndUpdate({ _id: projectId, status: Status.ACTIVE }, {
        $addToSet: {
            channels: { $each: configChannel }
        }
    }, { new: true, useFindAndModify: false });
}
exports.connectFacebook = async (req, res, next) => {
    try {
        const project = await Project.count({ _id: req.params.id });
        if (!project) return res.redirect(req?.headers?.referer + "project/" + projectId + "?success=false&message=" + err.PROJECT_NOT_FOUND.message + "&messageCode=" + err.PROJECT_NOT_FOUND.messageCode)
        passport.authenticate('facebook', { state: JSON.stringify({ projectId: req.params.id, referer: req?.headers?.referer }), scope: ['email', 'pages_manage_metadata', 'public_profile', 'pages_manage_engagement', 'pages_show_list', 'read_page_mailboxes', 'pages_messaging', 'pages_messaging_subscriptions', 'pages_read_user_content', 'pages_read_engagement', 'read_insights'] }).call(this, req, res, next)
    } catch (error) {
        console.log(error);
        res.redirect(req?.headers?.referer + "project/" + projectId + "?success=false&message=" + error.message)
    }
}
exports.connectFacebookCallback = async (req, res, next) => {
    try {
        passport.authenticate('facebook', async function (_err, data, info) {
            const { projectId, referer } = JSON.parse(data.query);
            try {
                if (_err) {
                    errorHandler(res, _err)
                } else {
                    const session = await conn.startSession();
                    await session.withTransaction(async () => {
                        const channels = await Promise.all(data?.page?.map(async c => {
                            const isEnableFacebookMessage = await registerWebhookEvent(c.id, c.access_token);
                            const avt = await getPageAvatar(c.id);
                            return Channel.findOneAndUpdate({ _id: c.id, project: projectId }, {
                                type: TypeChannel.FACEBOOK,
                                _id: c.id,
                                name: c.name,
                                accessToken: c.access_token,
                                isEnableMessage: isEnableFacebookMessage,
                                project: projectId,
                                avatar: avt?.data?.url,
                            }, { upsert: true, new: true, useFindAndModify: false, session })
                        }))
                        const project = await Project.findOne({ _id: projectId, status: Status.ACTIVE });
                        if (!project) return res.redirect(referer + "project/" + projectId + "?success=false&message=" + err.PROJECT_NOT_FOUND.message + "&messageCode=" + err.PROJECT_NOT_FOUND.messageCode)
                        channels?.map(c => {
                            if (project.channels?.indexOf(c._id?.toString()) < 0) {
                                project.channels.push(c._id);
                            }
                        })
                        await project.save({ session })
                        res.redirect(referer + "project/" + projectId + "?success=true")
                    })
                    session.endSession();
                }
            } catch (error) {
                if (error.code === 11000)
                    res.redirect(referer + "project/" + projectId + "?success=false&message=" + err.CHANNEL_DUPLICATED.message + "&messageCode=" + err.CHANNEL_DUPLICATED.messageCode)
                res.redirect(referer + "project/" + projectId + "?success=false&message=" + error.message)
            }
        }).call(this, req, res, next)
    } catch (error) {
        errorHandler(res, error)
    }
}
exports.removeChannels = async (req, res) => {
    try {
        const session = await conn.startSession();
        await session.withTransaction(async () => {
            const projectId = req.params.id;
            const ids = req.body.idChannelsDelete;
            const { deletedCount } = await Channel.deleteMany({ _id: { $in: ids }, project: projectId }, { session })
            if (deletedCount !== ids?.length)
                throw new Error(err.CHANNEL_NOT_FOUND_IN_PROJECT.messageCode)
            const project = await Project.findOneAndUpdate({ _id: projectId, status: Status.ACTIVE }, {
                $pull: {
                    channels: { $in: ids }
                }
            }, { new: true, useFindAndModify: false, session });
            if (!project) errorHandler(res, err.PROJECT_NOT_FOUND)
            successHandler(res, { project, channelDeleteCount: deletedCount }, 200)
        })
        session.endSession();
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        // ========== Test ==================
        // await sendMessage(
        //     '6065039103566611',
        //     'EAAlK610BXFsBALgeSMZB2wbmZC0WAjzya5kp5r86q1s501KPApSZA62svgTlXsZBjmghFuxfiZB0nlWaezmSb6ZACqu39KflmvVxogdSPKtIwDWT06klaG4jilfCYVyCZBCCZBPHZAZAZBuZClqWWeShbU34OvujdkrePIDknLeW0NWZCZCaIfVaXuMSw8K3Sd575znhoZD',
        //     'test')
        // await getUserProfile(
        //     '6065039103566611',
        //     'EAAlK610BXFsBALgeSMZB2wbmZC0WAjzya5kp5r86q1s501KPApSZA62svgTlXsZBjmghFuxfiZB0nlWaezmSb6ZACqu39KflmvVxogdSPKtIwDWT06klaG4jilfCYVyCZBCCZBPHZAZAZBuZClqWWeShbU34OvujdkrePIDknLeW0NWZCZCaIfVaXuMSw8K3Sd575znhoZD')
        // await getListConversations('107613858079257','EAAlK610BXFsBALgeSMZB2wbmZC0WAjzya5kp5r86q1s501KPApSZA62svgTlXsZBjmghFuxfiZB0nlWaezmSb6ZACqu39KflmvVxogdSPKtIwDWT06klaG4jilfCYVyCZBCCZBPHZAZAZBuZClqWWeShbU34OvujdkrePIDknLeW0NWZCZCaIfVaXuMSw8K3Sd575znhoZD')
        // await getListMessage('t_3035340680080142','EAAlK610BXFsBALgeSMZB2wbmZC0WAjzya5kp5r86q1s501KPApSZA62svgTlXsZBjmghFuxfiZB0nlWaezmSb6ZACqu39KflmvVxogdSPKtIwDWT06klaG4jilfCYVyCZBCCZBPHZAZAZBuZClqWWeShbU34OvujdkrePIDknLeW0NWZCZCaIfVaXuMSw8K3Sd575znhoZD')
        await getMessage('m_ImQVFY-8U1ir1v2fH0yWOq02UcJu6tIX7cCEdh-KfqK941OzVk7rvmY8aCkOVKl36ynZV0OsyMPCmQO5XyPFVA', 'EAAlK610BXFsBALgeSMZB2wbmZC0WAjzya5kp5r86q1s501KPApSZA62svgTlXsZBjmghFuxfiZB0nlWaezmSb6ZACqu39KflmvVxogdSPKtIwDWT06klaG4jilfCYVyCZBCCZBPHZAZAZBuZClqWWeShbU34OvujdkrePIDknLeW0NWZCZCaIfVaXuMSw8K3Sd575znhoZD')
    } catch (error) {

    }
}