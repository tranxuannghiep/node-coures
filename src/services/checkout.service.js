"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquiredLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    discount_code,
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exists
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart not found");

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0, // tong thanh toan
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, discount_code, item_products } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products);
      console.log("::checkProductByServer", checkProductByServer);

      if (checkProductServer.some((p) => !p)) {
        throw new BadRequestError("order wrong !!!");
      }

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        discount_code,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products,
      };

      // neu co discount_code check xem co ton tai hay k
      if (discount_code) {
        const { discount = 0 } = await DiscountService.getDiscountAmount({
          code: discount_code,
          userId,
          shopId,
          products: checkProductServer,
        });

        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount -= discount;
        }
      }

      // tong thanh toan cuoi
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  //order

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { checkout_order, shop_order_ids_new } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    // check lai 1 lan nua xem san pham co vuot ton kho khong

    const products = shop_order_ids_new.flatMap((item) => item.item_products);
    const acquiredProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];

      const keyLock = await acquiredLock(productId, quantity, cartId);
      acquiredProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check neu co 1 san pham het hang trong kho
    if (acquiredProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham duoc cap nhat, vui long quay lai gio hang..."
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    //truong hop: neu insert thanh cong, thi remove product trong cart

    if (newOrder) {
      // remove product in cart
    }
  }
}

module.exports = CheckoutService;
