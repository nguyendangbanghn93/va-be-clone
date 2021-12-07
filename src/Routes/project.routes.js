const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth.middleware");
const projectMiddleware = require("../Middleware/project.middleware");
const validate = require("../Middleware/validators.middleware");
const projectController = require("../Controllers/project.controllers");

router.post("/create", auth, validate.project.create, projectController.create);
router.post("/delete/:id", auth, projectController.delete);
router.get("/detail/:id", auth, projectController.detail);
router.get("/list", auth, projectController.list);

router.post("/add_users/:id", auth, projectMiddleware.isAdmin, validate.project.addUsers, projectController.addUsers);
router.post("/add_users/:id", auth, projectMiddleware.isAdmin, validate.project.addUsers, projectController.addUsers);
router.post("/remove_users/:id", auth, projectMiddleware.isAdmin, validate.project.removeUsers, projectController.removeUsers);
router.post("/update_role_users/:id", auth, projectMiddleware.isAdmin, validate.project.updateRoleUsers, projectController.updateRoleUsers);
router.post("/update_name/:id", auth, projectMiddleware.isAdmin, validate.project.updateName, projectController.updateName);

router.get("/connect_facebook/connect/:id", projectController.connectFacebook);
router.get("/connect_facebook/callback", projectController.connectFacebookCallback);

router.post('/remove_channels/:id', auth, projectMiddleware.isAdmin, validate.project.removeChannels, projectController.removeChannels);
router.get('/send_message', projectController.sendMessage);


module.exports = router;