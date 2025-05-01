# Use official Node image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose port 5000 (auth-service runs on this port)
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]
