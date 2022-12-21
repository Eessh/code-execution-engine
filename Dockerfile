FROM alpine:latest

RUN apk update
RUN apk --no-cache add gcc g++ python3 nodejs npm

RUN mkdir /app
WORKDIR /app
COPY ./package*.json .
RUN npm install

COPY . .

# ARG PORT_ARG=5000
# ENV PORT=$PORT_ARG
EXPOSE 5000

# CMD [ "npm", "start" ]
CMD ["node", "index.js"]
