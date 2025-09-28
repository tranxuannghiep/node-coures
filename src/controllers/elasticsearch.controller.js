"use strict";

const { SuccessResponse } = require("../core/success.response");
const { createIndex } = require("../services/elasticsearch.service");


class ElasticsearchController {
    createIndex = async (req, res, next) => {
        console.log(`[P]::createIndex`, req.body);

        new SuccessResponse({
            message: "Successfully createIndex",
            metadata: await createIndex(req.body),
        }).send(res);
    };


}

module.exports = new ElasticsearchController();
