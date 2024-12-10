FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install --prod
EXPOSE 3000
CMD ["node", "app.js"]