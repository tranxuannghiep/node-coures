"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
// router.use(apiKey);
// check permission
// router.use(permission("0000"));

router.use("/v1/api/user", require("./user"));
router.use("/v1/api/email", require("./email"));
router.use("/v1/api/rbac", require("./rbac"));
router.use("/v1/api/comment", require("./comment"));
// router.use("/v1/api/checkout", require("./checkout"));
// router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access"));

module.exports = router;
