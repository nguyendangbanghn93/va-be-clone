const express = require("express");
const { getVaConfig, createVaConfig } = require("../Controllers/vaConfig.controllers");
const router = express.Router();
const auth = require("../Middleware/auth.middleware");
const vaConfigMiddleware = require("../Middleware/vaConfig.middleware");
router.get("/get_conf", auth, getVaConfig);
router.post("/create", auth, vaConfigMiddleware.preCheckVaConfig, createVaConfig);

module.exports = router;