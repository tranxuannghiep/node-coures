const { Types } = require("mongoose");
const { product } = require("../product.model");
const { NotFoundError } = require("../../core/error.response");

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundProduct) throw new NotFoundError("Product not found");
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { isModified } = await foundProduct.save();
  return isModified;
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
};
