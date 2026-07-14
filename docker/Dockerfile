# ============================================================
# Stage 1: Build
# ============================================================
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Install dependencies (利用 Docker 缓存层)
COPY package.json package-lock.json .npmrc ./
COPY patches/ ./patches/
RUN npm ci --registry=https://registry.npmmirror.com

# 2. Copy source code
COPY babel.config.js jsconfig.json vue.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# 3. Build (production)
ARG BUILD_MODE=prod
RUN npm run ${BUILD_MODE}

# ============================================================
# Stage 2: Nginx serving
# ============================================================
FROM nginx:1.25-alpine

# 解决时区
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 清除默认的 nginx 配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 复制 nginx 配置
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 从 builder 阶段复制构建产物
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
