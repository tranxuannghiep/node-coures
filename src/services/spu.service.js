'use strict';

const { NotFoundError } = require("../core/error.response");
const { findShopById } = require("../models/repositories/shop.repo");
const spuModel = require("../models/spu.model");
const { randomProductId } = require("../utils");
const { newSku, allSkuBySpuId } = require("./sku.service");
const _ = require("lodash")

const newSpu = async ({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = []
}) => {
    try {
        // 1. check if Shop exist
        const foundShop = await findShopById({ shop_id: product_shop });
        if (!foundShop) throw new NotFoundError("Shop not found");

        // 2. create new spu
        const spu = await spuModel.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variations,
        })

        if (spu && sku_list.length > 0) {
            // 3. create skus

            newSku({
                spu_id: spu.product_id,
                sku_list
            }).then()
        }

        // 4.sync data via elasticsearch (search.service)

        // 5. response result object
        return !!spu
    } catch (error) {

    }
}

const oneSpu = async ({ spu_id }) => {
    const spu = await spuModel.findOne({ product_id: spu_id }).lean()
    if (!spu) {
        throw new NotFoundError("Spu not found")
    }

    const skus = await allSkuBySpuId({ product_id: spu_id })

    return {
        spu_info: _.omit(spu, ['updatedAt', '__v']),
        sku_list: skus.map(sku => _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']))
    }
}

module.exports = {
    newSpu,
    oneSpu
}