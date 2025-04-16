require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const app = express();

// require("./tests/inventory.test");
// const productTest = require("./tests/product.test");

// productTest.purchaseProduct({
//   productId: "123",
//   quantity: 2,
// });

// init middleware
app.use(morgan("dev")); // debug code
app.use(helmet()); // mũ bảo hiêm => không cho xem header dùng ngôn ngữ gì
app.use(compression()); // vận chuyển data nhanh hơn
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init db
require("./dbs/init.mongodb");
// checkOverload();
// init router
app.use("/", require("./routers"));

// handling error

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
