# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG VITE_ERPNEXT_API_URL=http://localhost:8000
ARG VITE_ERPNEXT_API_KEY=
ARG VITE_ERPNEXT_API_SECRET=
ENV VITE_ERPNEXT_API_URL=$VITE_ERPNEXT_API_URL
ENV VITE_ERPNEXT_API_KEY=$VITE_ERPNEXT_API_KEY
ENV VITE_ERPNEXT_API_SECRET=$VITE_ERPNEXT_API_SECRET

RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
