const formidable = require("formidable");
const request = require('request-promise');
var fs = require('fs');
const Stringee = require("../Models/stringee.model");
const err = require("../Errors/index");
const { successHandler, errorHandler } = require("../Utils/ResponseHandler");
const { ProjectNames } = require("../Enums");
const stringeeConfig = require("../../config/stringee.config");

exports.create = async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        let userId
        form.parse(req, async function (err, fields, files) {
            let newPath
            let note = ''
            let projectName = fields.projectName
            let contact = fields.contact
            userId = fields.userId
            if (!userId)
                return errorHandler(res, {
                    message: 'userId is required'
                })
            else
                delete fields.userId
            if (!contact)
                return errorHandler(res, {
                    message: 'contact is required'
                })
            else
                delete fields.contact
            if (!projectName)
                return errorHandler(res, {
                    message: 'projectName is required'
                })
            else
                delete fields.projectName

            if (files?.requestImage) {
                const path = files?.requestImage?.filepath
                const originalFilename = files?.requestImage?.originalFilename
                newPath = `${path}_${originalFilename}`
                fs.renameSync(path, newPath)
            }
            for (const [key, value] of Object.entries(fields)) {
                note += `${key}: ${value}\n`
            }

            const body = {
                create_reason: 0,
                subject: `Báo lỗi từ ${projectName}123123`,
                user_id:userId,
                assignee: "AC427L4IJX",
                // assigneeGroup: "GRFCWE24",
                status: 0,
                contact: contact,
                type: 2,
                priority: 2
            }
            const tiketRes = await request({
                method: 'POST',
                uri: `${stringeeConfig.stringeex_api_url}/ticket`,
                body,
                json: true,
                headers: {
                    'X-STRINGEE-AUTH': stringeeConfig.x_stringee_auth
                }
            })
            if (tiketRes.msg != "Success")
                return errorHandler(res, tiketRes)
            else
                if (newPath) {
                    const formData = {
                        "is_internal_note": "true",
                        "note": note,
                        "ticket_id": tiketRes.id,
                        "file_upload": fs.createReadStream(newPath),
                        "multipartFormdata": "true"
                    }
                    const tiketNoteRes = await request({
                        method: 'POST',
                        uri: `${stringeeConfig.stringeex_api_url}/ticketnote`,
                        headers: {
                            'X-STRINGEE-AUTH': stringeeConfig.x_stringee_auth,
                            "Content-Type": "multipart/form-data"
                        },
                        formData
                    })
                    if (JSON.parse(tiketNoteRes).msg == "Success"){
                        const stringee = new Stringee({
                            userId,
                            stringeeId: tiketRes.id,
                            projectName
                        })
                        await stringee.save()
                        return successHandler(res, JSON.parse(tiketNoteRes), 200)
                    }
                    else
                        return errorHandler(res, tiketNoteRes)
                }
                else {
                    return successHandler(res, tiketRes, 200)
                }
        });

    } catch (error) {
        console.log(`error`, error)
        return errorHandler(res, error)
    }
};
exports.getList = async (req, res) => {
    try {

    } catch (error) {
        return errorHandler(res, error)
    }
};