FROM alpine:latest

RUN apk update
RUN apk --no-cache add gcc
RUN apk --no-cache add g++
RUN apk --no-cache add python3
RUN apk --no-cache add nodejs
RUN apk --no-cache add npm

RUN mkdir /app
WORKDIR /app
COPY ./package*.json .
RUN npm install

COPY . .

# ARG PORT_ARG=5000
# ENV PORT=$PORT_ARG
EXPOSE 5000

CMD [ "npm", "start" ]