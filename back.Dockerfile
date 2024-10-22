# Step 1: Build the application
FROM coredin/base:latest AS builder

# Step 2: Set up the production environment
FROM node:20.14-alpine3.19

# Step 3: Copy 
COPY --from=builder coredin/packages/backend/dist app/packages/backend/dist
COPY --from=builder coredin/packages/backend/config app/packages/backend/config
COPY --from=builder coredin/packages/shared/dist app/packages/shared/dist
COPY --from=builder coredin/packages/shared/package.json app/packages/shared
COPY --from=builder coredin/packages/backend/package.json app/packages/backend
COPY --from=builder coredin/package.json app/
COPY --from=builder coredin/yarn.lock app/
COPY --from=builder coredin/.yarnrc.yml app/
COPY --from=builder coredin/.yarn app/.yarn

# Step 4: Install deps required for prod (nestJs build doesn't include them)
WORKDIR /app
RUN yarn workspaces focus @coredin/backend --production

# Step 5: Install curl required for health check
RUN apk add --no-cache curl

# Step 6: Execute pending migrations and run app
EXPOSE 3000
WORKDIR /app/packages/backend
CMD yarn typeorm:migrate && node dist/main.js