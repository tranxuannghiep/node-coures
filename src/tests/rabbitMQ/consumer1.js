const amqplib = require("amqplib");

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueName = "test-topic";

        await channel.assertQueue(queueName, {
            durable: true
        });

        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                console.log("Received:", msg.content.toString());
            }
        },{
            noAck: true // true: auto ack, false: manual ack
        });
    } catch (error) {
        console.log(error);
    }
}

runConsumer().catch((e) => console.log(e));