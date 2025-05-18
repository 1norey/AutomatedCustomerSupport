FROM node:18

# ✅ Install netcat variant
RUN apt-get update && apt-get install -y netcat-openbsd

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Make wait script executable
RUN chmod +x wait-for-postgres.sh

EXPOSE 5000

# Run wait script then app
CMD ["./wait-for-postgres.sh"]
