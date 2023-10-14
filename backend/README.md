# Geo-Quiz backend

## Requirements / setup

Perform these steps before running any other scrips:

1. Set up a PostgreSQL database. **Note:** only Postgres is supported, other dialects do not work
2. Copy `.env.template` into `.env` and fill in all the values
3. Run `npm install`
4. You can now populate the db with country data with [npm setup](#npm-run-setup). You can also create your own script to populate it if you want to use different data set
5. Setup is done

## Running the project

### Development mode

1. Perform steps in setup section
2. `npm run dev`
3. Note: might have to change frontend's api url in `../frontend/.env`

### Production mode

1. Perform steps in setup section
2. Create build of frontend with [npm run build:front](#npm-run-buildfront)
3. Compile typescript with [npm run tsc](#npm-run-tsc)
4. `npm start`

## Available scripts

### `npm run setup`

Populates database with country data from [restcountries.com](https://restcountries.com). Must be ran at least once before starting application _(or after setting up database)_.

Setup is safe to run multiple times: it will not insert same data twice into db (though you don't need to run it every time you're running backend, only after db setup).

### `npm run dev`

Run project in development mode.

### `npm start`

Run project in production mode. You must run `npm run tsc` and `npm run build:front` first.

### `npm run build:front`

Creates a build of frontend and places it into `./build`.

### `npm run tsc`

Compiles TS into JS.

### `npm run test`

### `npm run lint`

### `npm run migration:down`

Revert the most recent database migration.
