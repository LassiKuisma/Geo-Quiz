# Geo-Quiz backend

## Available scripts

### `npm run setup:import-country-data`

Populates database with country data from [restcountries.com](https://restcountries.com).

Setup is safe to run multiple times: it will not insert same data twice into db (though you don't need to run it every time you're running backend, only after db setup).

If you need to run this command on different db url than defined in .env _(for example populating a production database from your local machine during very first setup)_, you can provide the url with:

`DATABASE_URL=<database url> npm run setup:import-country-data`

In case you don't want to save the database url into your terminal history you can save the url into a file and pass it like this:

`npm run setup:import-country-data --db-url-file=<file>`

### `npm run dev`

Run project in development mode.

### `npm start`

Run project in production mode. You must build the project first.

### `npm run build`

Compiles TS into JS.

### `npm run test`

### `npm run lint`

### `npm run migration:down`

Revert the most recent database migration.
