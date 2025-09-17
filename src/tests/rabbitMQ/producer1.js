const amqplib = require("amqplib");

const messages = "Message from producer 1";

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "test-topic";

        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(messages), {
            persistent: true
        });


    } catch (error) {
        console.log(error);
        
    }
}

runProducer().catch((e) => console.log(e));