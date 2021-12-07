const { model } = require("mongoose")

module.exports.Status = {
    ACTIVE: "ACTIVE",
    DEACTIVE: "DEACTIVE",
    DELETE: "DELETE"
}
module.exports.RoleSystem = {
    ADMIN: "ADMIN",
    USER: "USER"
}
module.exports.RoleProject = {
    ADMIN: "ADMIN",
    CSKH: "CSKH"
}
module.exports.Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    UNKNOWN: "UNKNOWN",
}
module.exports.TypeChannel = {
    FACEBOOK: "FACEBOOK",
    ZALO: "ZALO",
    TWISTER: "TWISTER",
}
module.exports.TypeVA = {
    RASA: "RASA",
    COMET: "COMET",
}
module.exports.ProjectNames = {
    FBANG: "FBANG",
    FUNZY: "FUNZY",
}