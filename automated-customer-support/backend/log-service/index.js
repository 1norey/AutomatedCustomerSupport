// log-service/index.js
const { consumeFromQueue } = require("./utils/rabbitmq");

//  Listen for ticketCreated events
consumeFromQueue("ticketCreated", (ticket) => {
  console.log("📝 [ticketCreated] Event received in Log-Service:");
  console.log("ID:", ticket.id);
  console.log("User:", ticket.userId);
  console.log("Subject:", ticket.subject);
  console.log("Message:", ticket.message);
  console.log("Status:", ticket.status);
  console.log("Created At:", ticket.createdAt);
  console.log("-----");
});
