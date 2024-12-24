FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY ./ ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "app.js"]