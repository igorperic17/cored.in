# Coredin

CoredIn is a professional SocialFi app empowered with self-sovereign identity.

## Quick Start Notes

1.  Run `yarn` to install all the dependencies
2.  Run `yarn back-dev` to start your BackEnd dev environment
3.  Run `yarn front-dev` to start your FrontEnd dev environment
OR
2. Run `yarn dev` to start both back and front dev environments

## Database
This project uses a posgreSQL DB, one sample instance could be run with `docker compose up -d` inside packages/backend.

It can then be accessed directly with `psql -U dev_user -h localhost -p 5432 -d coredin_dev_db`

## Technologies

This project is built with the following open source libraries, frameworks and languages. It uses typescript.
| Tech | Description |
| --------------------------------------------- | ------------------------------------------------------------------ |
| ------ | ------ React Frontend Environment ------ |
| [Vite JS](https://vitejs.dev/) | Next Generation Frontend Tooling |
| ------ | ------ CSS Framework ------ |
| [Chakra](https://chakra-ui.com/) | A simple, modular and accessible component library that gives you the building blocks you need to build your React applications. |
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