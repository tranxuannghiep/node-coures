"use strict";

const { createTokenPair } = require("../auth/authUtils");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

const KeyTokenService = require("./keytoken.service");
const { getInfoData } = require("../utils");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists ??

      const holderShop = await shopModel
        .findOne({
          email: email,
        })
        .lean();

      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name: name,
        email: email,
        password: passwordHash,
        role: RoleShop.SHOP,
      });

      if (newShop) {
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey: publicKey,
          privateKey: privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "keyStore error",
          };
        }

        const tokens = createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
