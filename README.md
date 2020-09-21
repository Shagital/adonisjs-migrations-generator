## Setup
- Clone the repo
- Create and update your .env file i.e `cp .env.example .env`.
- Run `yarn install` to install adonis and other dependencies
- Run `adonis migration:run --seed` to create tables and seed data
- Run `adonis serve --dev` to start the dev server

## Tested on
- node v10.20.1
- npm 6.14.4
- MySQL  Ver 8.0.19 for osx10.14 on x86_64 (Homebrew)

## Tests
- Create a Deploy env i.e `cp .env.example .env.testing`
- Run migrations `ENV_PATH=.env.testing adonis migration:run --seed`
- Run Tests `ENV_PATH=.env.testing adonis test`

## Deploy login
- To trigger deploy manually, call `/deploy?token=` where token is the APP_KEY in `.env`

## Deploy
- SHH and pull
- Login to CPanel
- Run migrate script

