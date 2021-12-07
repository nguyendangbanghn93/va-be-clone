const User = require("../Models/user.model");
const Project = require("../Models/project.model");
const { errorHandler } = require("../Utils/ResponseHandler");
const err = require("../Errors/index");
const { RoleProject } = require("../Enums");
const isRole = (role) => {
    return async (req, res, next) => {
        try {
            const user = new User(req.user);
            const projectId = req.params.id;
            const project = await Project.findById(projectId);
            if (!project) return errorHandler(res, err.PROJECT_NOT_FOUND);
            const isTrue =
                !!project?.users?.find(
                    (d) => d.role === role && d.userId.toString() == user._id.toString()
                );
            if (!isTrue) return errorHandler(res, err.NOT_AUTHORIZED);
            req.project = project;
            next();
        } catch (error) {
            return errorHandler(res, error);
        }
    };
};
const isMember = async (req, res, next) => {
    try {
        const user = new User(req.user);
        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if (!project?.users.find(d => d.userId?.toString() === user._id?.toString())) return errorHandler(res, err.NOT_AUTHORIZED);
        req.project = project;
        next();
    } catch (error) {
        return errorHandler(res, error);
    }
}
module.exports = { isAdmin: isRole(RoleProject.ADMIN), isCSKH: isRole(RoleProject.CSKH), isMember };
