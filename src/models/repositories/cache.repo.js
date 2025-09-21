'use strict';

const { getIORedis } = require("../../dbs/init.ioredis");

const redisCache = getIORedis().instanceConnect

const setCacheIO = async ({ key, value }) => {
    if (!redisCache) {
        throw new Error("Redis client not initialized")
    }

    try {
        return await redisCache.set(key, value)

    } catch (error) {
        throw new Error(error.message)
    }
}

const setCacheIOExpiration = async ({ key, value, expirationInSeconds }) => {
    if (!redisCache) {
        throw new Error("Redis client not initialized")
    }

    try {
        return await redisCache.set(key, value, "EX", expirationInSeconds)

    } catch (error) {
        throw new Error(error.message)
    }
}

const getCacheIO = async ({ key }) => {
    try {
        if (!redisCache) {
            throw new Error("Redis client not initialized")
        }

        const value = await redisCache.get(key)

        return JSON.parse(value)

    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    setCacheIO,
    setCacheIOExpiration,
    getCacheIO
}