const express = require("express")
const router = express.Router()
const apiController = require("../controllers/api")
const multer = require("multer")


router.get("/posts", apiController.index)
router.post("/post/add", multer({dest: "public/images"}).single("image") ,apiController.store)
router.post("/delete/:id", apiController.destroy)
router.get("/post/:id", apiController.show)



module.exports = router