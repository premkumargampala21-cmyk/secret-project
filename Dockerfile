FROM node:22-alpine

WORKDIR /app

# Install dependencies, including tsx used by the Express server startup script.
COPY package.json ./
RUN npm install --include=dev

# Copy the app source and static assets.
COPY . .

# Build the React/Vite frontend.
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
