# Use an official Node.js runtime as a parent image
FROM node:10-alpine

# Set the working directory in the container
WORKDIR /app

# Copy files to the working directory
COPY . .

RUN npm install

# Default port
ENV PORT=8080

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application
CMD ["npm", "run", "serve"]
