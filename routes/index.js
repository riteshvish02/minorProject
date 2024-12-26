const express = require("express");
const router = express.Router();
const version =  require("./v1")

router.use("/",version);
module.exports = router;