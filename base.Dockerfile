# Step 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /coredin

COPY . .

RUN yarn set version stable
RUN yarn install
RUN yarn build