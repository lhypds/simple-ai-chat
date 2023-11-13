FROM node:18
RUN apt update && apt install -y curl vim

WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
RUN npm install next -g
COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]