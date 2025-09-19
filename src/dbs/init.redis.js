'use strict';

// const redis = require("redis")

// const client = redis.createClient({
//     host: 'localhost',
//     port: 6379,
//     username: 'default',
//     password: '123456789'
// })

// client.on("error", (err) => {
//     console.error("Redis error:", err);
// });


// module.exports = client

const redis = require("redis");
const { RedisErrorResponse } = require("../core/error.response");

let client = {}, statusConnectRedis = {
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
        console.log(`connectionRedis - Connection status: connected`);
        clearTimeout(connectionTimeout)
        connectionTimeout = null;
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`);
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`);
        clearTimeout(connectionTimeout)
        connectionTimeout = null;
    })

    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`connectionRedis - Connection status: error ${error}`);

        if (error.code === 'ECONNREFUSED') {
            handleTimeoutError()
        }

    })
}

const initRedis = async () => {
    const instanceRedis = redis.createClient()

    client.instanceConnect = instanceRedis

    try {
        await instanceRedis.connect(); // <- cần dòng này
        console.log("✅ Redis connected successfully");
        client.instanceConnect = instanceRedis;
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
    }
    handleEventConnection({ connectionRedis: instanceRedis })

}

const getRedis = () => client

const closeRedis = () => { }

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}