# Step 1: Build the application
FROM node:22.10-alpine3.20 AS builder

ENV NODE_OPTIONS=--max_old_space_size=8192

WORKDIR /coredin

COPY . .

RUN yarn install
RUN yarn workspace @coredin/shared build