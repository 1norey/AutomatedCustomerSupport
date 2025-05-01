# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port used by the gateway
EXPOSE 8080

# Start the gateway
CMD ["node", "index.js"]
