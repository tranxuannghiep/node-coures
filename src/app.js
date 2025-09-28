require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const app = express();
const { v4: uuidv4 } = require('uuid');
const logger = require("./loggers/mylogger.log");
const { initRedis } = require("./dbs/init.redis");
const { initIORedis } = require("./dbs/init.ioredis");
const { initElasticsearch } = require("./dbs/init.elasticsearch");

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

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.requestId = requestId;

  logger.log(`input params::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])

  next();
})

// init db
require("./dbs/init.mongodb");
// checkOverload();

// //init redis
// initRedis()

// init IOREDIS
initIORedis({
  IOREDIS_IS_ENABLED:true
})

// Elasticsearch
initElasticsearch({
  ELASTICSEARCH_IS_ENABLE:true
})

// init router
app.use("/", require("./routers"));

// handling error

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;

  const resMessage = `${statusCode} - Response: ${JSON.stringify(error)}`

  logger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    {
      message: error.message || "Internal Server Error",
    }
  ])

  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
