const { Types } = require("mongoose");
const { product } = require("../product.model");
const { NotFoundError } = require("../../core/error.response");
const { selectData, unSelectData } = require("../../utils");

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

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundProduct) throw new NotFoundError("Product not found");
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { isModified } = await foundProduct.save();
  return isModified;
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        $text: { $search: regexSearch },
        isPublished: true,
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (Number(page) - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  const result = await product
    .findById(product_id)
    .select(unSelectData(unSelect))
    .lean();
  if (!result) throw new NotFoundError("Product not found");
  return result;
};

const updateProductById = async ({
  product_id,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew });
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
  unpublishProductByShop,
  findAllPublishForShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
