const amqplib = require("amqplib");

const messages = "Message from producer 1";

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        
        const notificationExchange = "notificationExchange"; //direct
        const notificationQueue = 'notificationQueueProcess'; // assert queue
        const notificationExchangeDLX = "notificationExchangeDLX";
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // assert

        //1. Create exchange
        await channel.assertExchange(notificationExchange, 'direct', { durable: true });


        //2. Create queue
        const queueResult = await channel.assertQueue(notificationQueue, { 
            durable: true,
            exclusive: false, // false: cho phep cac ket noi khac truy cap vao cung 1 hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        });

        //3. Bind queue to exchange with routing key
        await channel.bindQueue(queueResult.queue, notificationExchange);

        //4. Send message to exchange with routing key
        const msg = "a new product created";
        console.log(" [x] Sent '%s'", msg);
        // await channel.sendToQueue(queueResult.queue, '', Buffer.from(msg), { persistent: true, expiration: '10000' }); // expiration: '10000' (10s)

        channel.publish(notificationExchange, '', Buffer.from(msg), { persistent: true, expiration: '10000' }); //persistent: message được lưu xuống disk (không mất khi RabbitMQ crash).

        setTimeout(()=>{
            connection.close();
        },500)
    } catch (error) {
        console.log(error);
        
    }
}

runProducer().catch((e) => console.log(e));