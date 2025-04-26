const amqplib = require("amqplib");

const orderedConsumer = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "ordered_queue_message";

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.prefetch(1);

  channel.consume(queue, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log(message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
};

orderedConsumer().catch((e) => console.log(e));
