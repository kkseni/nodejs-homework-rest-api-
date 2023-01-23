const express = require("express");

const { validation } = require("../../middlewares/validation");
const { users: usersControllers } = require("../../controllers");

const router = express.Router();

router.get("/current", usersControllers.getCurrent);

module.exports = router;
