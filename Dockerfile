FROM node:18

ENV NODE_ENV=production

# Create App directory
WORKDIR /app
RUN chown -R node:node /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
USER node

COPY --chown=node:node package*.json ./
RUN npm install
RUN npm ci --progress=false --no-audit --loglevel=error

COPY ./dist .
# COPY --chown=node:node src/ src/
# COPY --chown=node:node dist/ ./
# RUN mkdir db archive

CMD ["node","index.js"]