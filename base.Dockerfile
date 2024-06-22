# Step 1: Build the application
FROM node:20.14-alpine3.19 AS builder

WORKDIR /coredin

COPY . .

RUN yarn install
RUN yarn workspace @coredin/shared build
RUN yarn workspace @coredin/frontend build
RUN yarn workspace @coredin/backend prepare
RUN yarn workspace @coredin/backend build