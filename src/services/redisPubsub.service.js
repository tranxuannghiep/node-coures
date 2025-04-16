const Redis = require("redis");

class RedisPubsubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();

    this.subscriber.connect();
    this.publisher.connect();

    this.subscriber.on("error", (err) =>
      console.error("Subscriber error:", err)
    );
    this.publisher.on("error", (err) => console.error("Publisher error:", err));
  }

  async publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async subscribe(channel, callback) {
    await this.subscriber.subscribe(channel, (message) => {
      callback(channel, message);
    });
  }
}

module.exports = new RedisPubsubService();
