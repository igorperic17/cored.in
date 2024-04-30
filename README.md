# cored.in

cored.in is a professional SocialFi app empowered with self-sovereign identity.

## Quick Start Notes

1.  Run `yarn && yarn build` to install all the dependencies and `yarn prepare` to setup Typia validation library (only first time)
2.  Run `yarn back-dev` to start your BackEnd dev environment (make sure to copy packages/backend/secrets-backend-local.json.example as secrets-backend-local.json)
3.  Run `yarn front-dev` to start your FrontEnd dev environment (make sure to copy packages/frontend/.env.example as .env.json)
OR
2. Run `yarn dev` to start both back and front dev environments

## Database
This project uses a posgreSQL DB, one sample instance could be run with `docker compose up -d postgres` inside packages/backend.

It can then be accessed directly with `psql -U dev_user -h localhost -p 5432 -d coredin_dev_db`

## Technologies

This project is built with the following open source libraries, frameworks and languages. It uses typescript.
| Tech | Description |
| --------------------------------------------- | ------------------------------------------------------------------ |
| ------ | ------ React Frontend Environment ------ |
| [Vite JS](https://vitejs.dev/) | Next Generation Frontend Tooling |
| ------ | ------ Backend Framework ------ |
| [Nest JS](https://nestjs.com/) | A progressive Node.js framework for building efficient, reliable and scalable server-side applications |
| [TypeORM](https://typeorm.io/) | Typescript-first Object Relational Mapper (ORM) module for NestJS to easily work with PostgreSQL |
| [Nestia](https://github.com/samchon/nestia) | Simple and efficient data typing and input validation library |
| ------ | ------ CSS Framework ------ |
| [Chakra](https://chakra-ui.com/) | A simple, modular and accessible component library that gives you the building blocks you need to build your React applications |
| ------ | ------ CosmWASM Development Environment ------ |
| [TODO]() | RUST stuff for the contracts development environment for professionals |

## Adding packages

```
yarn workspace @coredin/backend add (package-name)

yarn workspace @coredin/frontend add (package-name)
```

## Building docker images

```
yarn docker
```