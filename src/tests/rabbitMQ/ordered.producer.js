const amqplib = require("amqplib");

const orderedProducer = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "ordered_queue_message";

  await channel.assertQueue(queue, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered_message_queue::${i}`;
    console.log(message);
    channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    conn.close();
  }, 1000);
};

orderedProducer().catch((e) => console.log(e));
