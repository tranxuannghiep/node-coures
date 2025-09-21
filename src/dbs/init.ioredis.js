'use strict';

const { Redis } = require("ioredis");
const { RedisErrorResponse } = require("../core/error.response");

let clients = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectionTimeout = null

const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: "Redis lỗi kết nói",
        en: "Redis connection error",
    }
}, REDIS_CONNECT_TIMEOUT = 10000



const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        // push telegram
        throw new RedisErrorResponse(
            REDIS_CONNECT_MESSAGE.message.VI, REDIS_CONNECT_MESSAGE.code
        );
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionIORedis - Connection status: connected`);
        clearTimeout(connectionTimeout)
        connectionTimeout = null;
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionIORedis - Connection status: disconnected`);
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionIORedis - Connection status: reconnecting`);
        clearTimeout(connectionTimeout)
        connectionTimeout = null;
    })

    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`connectionIORedis - Connection status: error ${error}`);

        if (error.code === 'ECONNREFUSED') {
            handleTimeoutError()
        }

    })
}

const initIORedis = async ({
    IOREDIS_IS_ENABLED,
    IOREDIS_HOST = process.env.REDIS_CACHE_HOST || "127.0.0.1",
    IOREDIS_PORT = process.env.REDIS_CACHE_PORT || 6379
}) => {
    if (IOREDIS_IS_ENABLED) {

        const instanceRedis = new Redis({
            host: IOREDIS_HOST,
            port: IOREDIS_PORT
        })

        clients.instanceConnect = instanceRedis

        try {
            clients.instanceConnect = instanceRedis;
        } catch (error) {
            console.error("❌ Redis connection failed:", error);
        }
        handleEventConnection({ connectionRedis: instanceRedis })
    }

}

const getIORedis = () => clients

const closeIORedis = () => { }

module.exports = {
    initIORedis,
    getIORedis,
    closeIORedis
}