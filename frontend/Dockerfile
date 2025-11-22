FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite をコンテナ外からアクセスできるようにする
EXPOSE 5173

# Vite Dev Server を --host 必須で起動
CMD ["npm", "run", "dev", "--", "--host=0.0.0.0"]
