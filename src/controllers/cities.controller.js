"use strict";

const { SuccessResponse } = require("../core/success.response");
const { getCity } = require("../services/cities.service");


class CityController {
    getCities = async (req, res, next) => {

        new SuccessResponse({
            message: "Successfully getCity",
            metadata: await getCity(),
        }).send(res);
    };


}

module.exports = new CityController();
