const express = require("express");
const router = express.Router();
const AdminRoute =  require("./adminRoute")
const UserRoute =  require("./userRoute")

router.use("/admin",AdminRoute);
router.use("/",UserRoute);
module.exports = router;