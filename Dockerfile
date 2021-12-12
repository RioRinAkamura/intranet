ARG NODE_VERSION=14.18.1
ARG NGINX_VERSION=1.21.4


# "development" stage
FROM node:${NODE_VERSION}-slim AS app_build

WORKDIR /usr/src/app

COPY . ./
RUN yarn install && yarn build --production


# "nginx" stage
# depends on the "build" stage above
FROM nginx:${NGINX_VERSION}-alpine AS app_nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

COPY --from=app_build /usr/src/app/build ./

EXPOSE 80

