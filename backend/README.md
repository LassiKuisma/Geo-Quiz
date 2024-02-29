# Geo-Quiz backend

## Requirements / setup

Perform these steps before running any other scrips:

1. Set up a PostgreSQL database. **Note:** only Postgres is supported, other dialects do not work
2. Copy `.env.template` into `.env` and fill in all the values
3. Run `npm install`
4. You can now populate the db with country data using [npm run setup:import-country-data](#npm-run-setupimport-country-data). You can also create your own script to populate it if you want to use different data set. **NOTE:** read the section about the command on how to run on production database from local machine
5. Setup is done

## Running the project

### Development mode

1. Perform steps in setup section
2. _(optional)_ start local database with [npm run start-dev-env](#npm-run-start-dev-env)
3. Insert country data with [npm run setup:import-country-data](#npm-run-setupimport-country-data) _(or create your own script)_
4. `npm run dev`
5. If running frontend in development mode:
   - check that url in `../frontend/.env` has same port as backend

### Production mode

1. Perform steps in setup section
2. Build common module and frontend with [npm run build:common](#npm-run-buildcommon) and [npm run build:front](#npm-run-buildfront)
3. Compile typescript with [npm run tsc](#npm-run-tsc)
4. `npm start`

## Available scripts

### `npm run setup:import-country-data`

Populates database with country data from [restcountries.com](https://restcountries.com).

Setup is safe to run multiple times: it will not insert same data twice into db (though you don't need to run it every time you're running backend, only after db setup).

If you need to run this command on different db url than defined in .env _(for example populating a production database from your local machine during very first setup)_, you can provide the url with:

`DATABASE_URL=<database url> npm run setup:import-country-data`

In case you don't want to save the database url into your terminal history you can save the url into a file and pass it like this:

`npm run setup:import-country-data --db-url-file=<file>`

### `npm run start-dev-env`

Start a Postgres container.

See [Docker documentation](https://docs.docker.com/compose/) for more info on Docker Compose.

### `npm run dev`

Run project in development mode.

### `npm start`

Run project in production mode. You must run `npm run tsc`, `npm run build:common` and `npm run build:front` first.

### `npm run build:front`

Creates a build of frontend and imports it for backend.

### `npm run build:common`

Creates a build of common module _(module containing shared types)_ and imports it for backend.

### `npm run tsc`

Compiles TS into JS.

### `npm run test`

### `npm run lint`

### `npm run migration:down`

Revert the most recent database migration.
