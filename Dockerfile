FROM node:latest
ADD . /app
WORKDIR /app
ENV DEBUG=financier
CMD [ "npm", "start" ]