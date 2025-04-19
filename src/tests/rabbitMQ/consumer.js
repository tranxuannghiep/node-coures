const amqplib = require("amqplib");

const runConsumer = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "test_queue";

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        console.log("Received:", msg.content.toString());
      }
    },
    { noAck: true }
  );
};

runConsumer().catch((e) => console.log(e));
