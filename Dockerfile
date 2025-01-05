# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Add this line before the build
ENV NEXT_PUBLIC_API_URL=https://skwebapi8080http-879200966247.us-south1.run.app

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js image to run the application
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 8080

# Start the Next.js application on port 8080
CMD ["npm", "run", "start", "--", "-p", "8080"]
