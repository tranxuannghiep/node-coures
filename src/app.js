require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const app = express();

// init middleware
app.use(morgan("dev")); // debug code
app.use(helmet()); // mũ bảo hiêm => không cho xem header dùng ngôn ngữ gì
app.use(compression()); // vận chuyển data nhanh hơn

// init db
require("./dbs/init.mongodb");
// checkOverload();
// init router
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello",
  });
});
// handling error

module.exports = app;
