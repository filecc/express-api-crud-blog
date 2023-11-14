const express = require("express")
const router = express.Router()
const apiController = require("../controllers/api")


router.get("/posts", apiController.index)
router.get("/post/:id", apiController.show)

module.exports = router