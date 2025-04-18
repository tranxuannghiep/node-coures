const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  unpublishProductByShop,
  findAllPublishForShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

// define Factory class to create product

class ProductFactory {
  /*
        type: 'Clothing'
    */

  static productRegistry = {}; // key- class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit: limit, skip: skip });
  }

  //PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit: limit, skip: skip });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async searchProducts(keySearch) {
    return await searchProductsByUser({ keySearch });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }

  static async updateProduct(product_id, type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).updateProduct(product_id);
  }
}

//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //create new product
  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    });

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });

      //push notification to system
      pushNotiToSystem({
        type: "SHOP-001",
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((rs) => console.log(rs))
        .catch((e) => console.log(e));
    }

    return newProduct;
  }

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({ product_id, bodyUpdate, model: product });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }

  async updateProduct(product_id) {
    const updateNest = updateNestedObjectParser(this);
    const objectParams = removeUndefinedObject(updateNest);

    if (objectParams.product_attributes) {
      // update child

      await updateProductById({
        product_id,
        bodyUpdate: objectParams,
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(product_id, objectParams);
    return updateProduct;
  }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new Furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }

  async updateProduct(product_id) {
    const updateNest = updateNestedObjectParser(this);
    const objectParams = removeUndefinedObject(updateNest);

    if (this.product_attributes) {
      // update child
      await updateProductById({
        product_id,
        bodyUpdate: removeUndefinedObject(
          updateNestedObjectParser(this.product_attributes)
        ),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(product_id, objectParams);
    return updateProduct;
  }
}

ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
