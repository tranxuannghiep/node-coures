const amqplib = require("amqplib");

const runProducer = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();

  const notificationExchange = "notificationEx";
  const notiQueue = "notificationQueueProcess";
  const notificationExchangeDLX = "notificationExDLX";
  const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

  // 1.Create Exchange
  await channel.assertExchange(notificationExchange, "direct", {
    durable: true,
  });

  // 2. create Queue
  const queueResult = await channel.assertQueue(notiQueue, {
    exclusive: false, // false: cho phép các kết nối khác truy cập vào cùng 1 hàng đợi
    deadLetterExchange: notificationExchangeDLX, // hết hạn hoặc lỗi thì gửi đến queue này
    deadLetterRoutingKey: notificationRoutingKeyDLX,
  });

  // 3. bindQueue
  await channel.bindQueue(
    queueResult.queue,
    notificationExchange,
    notificationRoutingKeyDLX
  ); // khi có message đến notificationExchange này thì sẽ gửi đến queue này

  // 4.Send Message
  const msg = "a new product";
  channel.publish(
    notificationExchange,
    notificationRoutingKeyDLX,
    Buffer.from(msg),
    {
      expiration: "4000",
    }
  );
  //   await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
  //     expiration: "10000", // 10s
  //   });
};

runProducer().catch((e) => console.log(e));
