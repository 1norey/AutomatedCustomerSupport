# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy only package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Expose the application's port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
