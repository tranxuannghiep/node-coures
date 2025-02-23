"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repositories/discount.repo");
const { convertToObjectIdMongo } = require("../utils");
const { findAllProducts } = require("./product.service");

/*
    Discount services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [Shop | Admin]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [Shop | Admin]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // kiem tra
    if (new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Invalid date range!");
    }

    // create index for discount
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscount(discount_id, payload) {}

  static async getListProductsByDiscountCode({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_code: code,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code not found!");
    }

    const filter = {
      product_shop: convertToObjectIdMongo(shopId),
      isPublished: true,
    };

    if (foundDiscount.discount_applies_to === "specific") {
      filter._id = { $in: foundDiscount.discount_product_ids };
    }

    return await findAllProducts({
      filter,
      limit: +limit,
      page: +page,
      sort: "ctime",
    });
  }

  static async getListDiscountCodesByShopId({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      sort: "ctime",
      filter: {
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_is_active: true,
      },
      model: discount,
      unSelect: ["__v", "discount_shopId"],
    });

    return discounts;
  }

  /*
    Apply Discount code
    Products = [
      {
        productId,
        quantity,
        price
      }
    ]
   */

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_code: code,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount Not Found");
    }

    const {
      discount_is_active,
      discount_type,
      discount_value,
      discount_max_value,
      discount_applies_to,
      discount_product_ids,
      discount_max_uses_per_user,
      discount_users_used,
      discount_min_order_value,
      discount_max_uses,
      discount_uses_count,
      discount_start_date,
      discount_end_date,
    } = foundDiscount;

    if (!discount_is_active) throw new BadRequestError("discount expired");

    if (discount_uses_count >= discount_max_uses)
      throw new BadRequestError("discount are out");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("discount has expired");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError("order value is too low");
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );

      if (userDiscount) {
        //...
      }
    }

    let totalOrderApplyDiscount = totalOrder;
    if (discount_applies_to === "specific") {
      // loc nhung product apply discount;
      totalOrderApplyDiscount = products
        .filter((p) => discount_product_ids.includes(p.productId))
        .reduce((acc, product) => acc + product.quantity * product.price, 0);

      if (totalOrderApplyDiscount < discount_min_order_value) {
        throw new BadRequestError("order value is too low");
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? Math.min(discount_value, totalOrderApplyDiscount)
        : discount_max_value
        ? Math.min(
            (totalOrderApplyDiscount * discount_value) / 100,
            discount_max_value
          )
        : (totalOrderApplyDiscount * discount_value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
}

module.exports = DiscountService;
