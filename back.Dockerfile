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
RUN cd app && yarn workspaces focus @coredin/backend --production

EXPOSE 3000
CMD [ "node", "app/packages/backend/dist/main.js" ]