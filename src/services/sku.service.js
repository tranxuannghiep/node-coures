'use strict';

const { NotFoundError } = require("../core/error.response");
const skuModel = require("../models/sku.model");
const { randomProductId } = require("../utils");

const _ = require("lodash")

const newSku = async ({
    spu_id,
    sku_list = []
}) => {
    try {
        const convert_sku_list = sku_list.map(sku => ({
            ...sku,
            product_id: spu_id,
            sku_id: `${spu_id}.${randomProductId()}`
        }))
        const skus = await skuModel.create(convert_sku_list)

        return skus
    } catch (error) {

    }
}

const oneSku = async ({ sku_id, product_id }) => {


    //read cached
    const sku = await skuModel.findOne({ sku_id, product_id }).lean()

    if (sku) {
        // set cached
    } else {
        throw NotFoundError("Sku not found")
    }

    return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])

}

const allSkuBySpuId = async ({ product_id }) => {
    const skus = await skuModel.find({ product_id }).lean()
    return skus
}


module.exports = {
    newSku,
    oneSku,
    allSkuBySpuId
}