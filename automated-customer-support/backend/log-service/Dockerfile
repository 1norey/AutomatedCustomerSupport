# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the full app
COPY . .

# Command to run the log-service
CMD ["node", "index.js"]
