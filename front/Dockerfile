FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
 
EXPOSE 5000
CMD [ "http-server", "-p 5000", "dist" ]
