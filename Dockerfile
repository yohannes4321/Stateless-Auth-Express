# Use the official Node.js image.
FROM node:14

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of your application files.
COPY . .

# Expose the port your app runs on.
EXPOSE 3000

# Command to run your app.
CMD ["npm", "start"]
