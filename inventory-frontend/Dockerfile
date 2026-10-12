# ============================
# Stage 1: Build con Node
# ============================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json primero (cache de capas)
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# ============================
# Stage 2: Servir con nginx
# ============================
FROM nginx:alpine

# Copiar la config personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de React
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]