'use strict';

const { CACHE_PRODUCT } = require("../configs/constants");
const { NotFoundError } = require("../core/error.response");
const { getCacheIO, setCacheIOExpiration } = require("../models/repositories/cache.repo");
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
        console.log(error);

    }
}

const oneSku = async ({ sku_id, product_id }) => {

    if (sku_id < 0 || product_id < 0) {
        return null
    }

    //read cached

    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}` // key cache

    const skuCache = await getCacheIO({ key: skuKeyCache })

    if (skuCache) {
        return skuCache
    } else {
        const sku = await skuModel.findOne({ sku_id, product_id }).lean()

        const skuCache = sku ? _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']) : null
        await setCacheIOExpiration({
            key: skuKeyCache,
            value: JSON.stringify(skuCache),
            expirationInSeconds: 30
        })

        return skuCache
    }




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