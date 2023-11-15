const path = require("path")

module.exports = function (req, res, next) {
    res.status(404).sendFile(path.resolve("./views/404.html"))
}