FROM --platform=linux/arm64 node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the app
COPY . .
RUN npm run generate

 

EXPOSE 80
CMD ["serve", "-s", ".output/public", "-l", "80"]