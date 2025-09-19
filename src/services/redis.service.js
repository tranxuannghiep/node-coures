"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const { getRedis } = require("../dbs/init.redis");
// const redisClient = redis.createClient();
// redisClient.connect();

// redisClient.on("error", (err) => {
//   console.error("Redis error:", err);
// });

const { instanceConnect: redisClient } = getRedis()

const acquiredLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3s

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, ai nam giu thi duoc vao thanh toan
    const result = await redisClient.SETNX(key, expireTime);
    console.log(`::result`, result);

    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await redisClient.pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = await promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquiredLock,
  releaseLock,
};
