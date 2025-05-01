// ticket-service/utils/rabbitmq.js
const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log("🐇 Connected to RabbitMQ");
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err);
  }
};

const publishToQueue = async (queueName, data) => {
  try {
    if (!channel) {
      console.warn("⚠️ RabbitMQ channel not ready");
      return;
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log(`📤 Event sent to queue "${queueName}"`);
  } catch (err) {
    console.error("❌ Failed to send message:", err);
  }
};

module.exports = { connectRabbitMQ, publishToQueue };
