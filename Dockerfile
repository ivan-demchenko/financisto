FROM node:latest
ADD . /app
WORKDIR /app
ENV DEBUG=bank-data
CMD [ "npm", "start" ]