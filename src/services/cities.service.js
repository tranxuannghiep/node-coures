const citiesModel = require("../models/cities.model");


const getCity = async () => {
    const cities = await citiesModel.find().lean();
   
    return cities
}


module.exports = {
    getCity
}