module.exports = {
  generate: (question) => {
    const responses = {
      greeting: "Hello! [Mock Response] How can I help?",
      pricing: "Our pricing starts at $10/month [Mock]",
      default: "AI service is currently unavailable [Mock Response]"
    };

    question = question.toLowerCase();
    if (question.includes("hi")) return responses.greeting;
    if (question.includes("price")) return responses.pricing;
    return responses.default;
  }
};