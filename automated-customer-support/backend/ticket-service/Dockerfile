# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Command to start the app
CMD ["node", "index.js"]
