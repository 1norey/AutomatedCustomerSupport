// log-service/utils/rabbitmq.js
const amqp = require("amqplib");

const RABBIT_URL = "amqp://localhost";

const consumeFromQueue = async (queueName, handler) => {
  try {
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`👂 Log-Service listening on queue: "${queueName}"`);

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        handler(data);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ:", err);
  }
};

module.exports = { consumeFromQueue };
