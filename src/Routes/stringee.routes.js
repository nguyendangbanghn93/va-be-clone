const express = require("express");
const { getList, create } = require("../Controllers/stringee.controllers");
const stringeeMiddleware = require("../Middleware/stringee.middleware");
const router = express.Router();

router.post("/create", /*stringeeMiddleware,*/ create);
router.post("/get_list", stringeeMiddleware, getList);

module.exports = router;