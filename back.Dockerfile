# Step 1: Build the application
FROM coredin/base:latest AS builder

# Step 2: Set up the production environment
FROM node:20-alpine

COPY --from=builder coredin/packages/backend/dist back/
# It may be worth to use a library that packs node modules required on build...
COPY --from=builder coredin/node_modules back/node_modules 

EXPOSE 3000
CMD [ "node", "back/main.js" ]