# ベースはNode 20 + Rust環境入り
FROM node:20-bullseye

# Rust環境を追加
RUN apt-get update && apt-get install -y curl libgtk-3-dev libwebkit2gtk-4.1-dev \
        build-essential libssl-dev pkg-config libayatana-appindicator3-dev librsvg2-dev \
        && curl https://sh.rustup.rs -sSf | sh -s -- -y \
        && echo 'source $HOME/.cargo/env' >> /root/.bashrc

WORKDIR /app
COPY package*.json ./

# npmを最新安定に固定
RUN npm install -g npm@10.7.0

# Node依存を先に入れる（キャッシュ効率化）
RUN npm ci

COPY . .

# ポート1420（Vite）を公開
EXPOSE 1420

# デフォルトコマンド
CMD [ "npm", "run", "tauri", "dev" ]
