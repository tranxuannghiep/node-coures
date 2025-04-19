const amqplib = require("amqplib");

const runProducer = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "test_queue";

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.sendToQueue(queue, Buffer.from("Hello World!"), {
    persistent: true,
  });
};

runProducer().catch((e) => console.log(e));
